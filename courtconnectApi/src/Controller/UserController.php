<?php

namespace App\Controller;

use App\Dto\UserDTO;
use App\Entity\User;
use App\Manager\UserManager;
use App\Repository\EventRepository;
use App\Repository\TerrainRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    public function __construct(private UserManager $userManager, private UserPasswordHasherInterface $passwordHasher, private UserRepository $userRepository)
    {

    }

    /**
     * Récupère les informations de l'utilisateur connecté
     * @return JsonResponse
     */
    #[Route('/api/userConnected', name: 'app_user_connected', methods: ['GET'])]
    public function userConnected(): JsonResponse
    {
        return $this->json($this->getUser(), 200, [], ['groups' => ['user']]);

    }

    #[Route('/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || empty($data['username']) || empty($data['password'])) {
            return $this->json(['message' => 'Données invalides'], 400);
        }

        $existingUser = $this->userRepository->findOneBy(['username' => $data['username']]);
        if ($existingUser) {
            return $this->json(['message' => 'Adresse e-mail déjà utilisée.'], 400);
        }

        $user = new User();
        $dto = new UserDTO();
        $dto->username = $data['username'];
        $dto->password = $this->passwordHasher->hashPassword($user, $data['password']);

        $user = $this->userManager->addUser($dto);

        if (!$user) {
            return $this->json(['message' => 'Erreur lors de la création du compte.'], 500);
        }

        return $this->json($user, 200, [], ['groups' => ['user']]);
    }


    #[Route('/api/updateUser', name: 'app_update_user')]
    public function updateUser(Request $request, UserManager $userManager, UserPasswordHasherInterface $passwordHasher): Response
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);
        $dto = new UserDTO();
        $dto->username = $data['username'];
        $dto->nom = $data['nom'];
        $dto->prenom = $data['prenom'];
        $dto->pseudo = $data['pseudo'];
        $dto->image_url = $data['imageUrl'];

        $user = $userManager->updateUser($dto, $user);

        if (!$user) {
            return $this->json(['message' => 'Erreur lors de la mise à jour du user.'], 500);
        }

        return $this->json($user, 200, [], ['groups' => ['user']]);
    }


    /**
     * Upload la photo de profil de l'utilisateur connecté.
     *
     * Cette fonction reçoit une image depuis le front,
     * la stocke dans un dossier dédié à l'utilisateur (/public/uploads/users/{id}),
     * et la nomme "image.{extension}".
     *
     * @param Request $request La requête HTTP contenant le fichier image.
     * @return JsonResponse Réponse JSON indiquant le succès ou l'échec de l'opération.
     */
    #[Route('/api/uploadProfilePicture', name: 'upload_profile_picture', methods: ['POST'])]
    public function uploadProfilePicture(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $file = $request->files->get('image');

        if (!$file || !$file->isValid()) {
            return $this->json(['message' => 'Image invalide.'], 400);
        }

        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/users/' . $user->getId();

        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0775, true);
        }

        $extension = $file->guessExtension() ?: 'jpg';
        $filename = 'image.' . $extension;

        try {
            $existingFiles = glob($uploadDir . '/image.*');
            foreach ($existingFiles as $oldFile) {
                unlink($oldFile);
            }
            $file->move($uploadDir, $filename);

            return $this->json(['message' => 'Image enregistrée.'], 200);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Erreur lors de l’enregistrement.'], 500);
        }
    }

    /**
     * Retourne l'URL de la photo de profil de l'utilisateur connecté.
     * Cherche automatiquement le fichier d'image quel que soit son format (jpg, png, etc.).
     *
     * @return JsonResponse Contient l'URL de l'image ou un message d'erreur si aucune image n'est trouvée.
     */
    #[Route('/api/user/getProfilPicture', name: 'get_profile_picture', methods: ['GET'])]
    public function getProfilePictureUrl(): JsonResponse
    {
        $user = $this->getUser()->getId();

        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/users/' . $user;
        $files = glob($uploadDir . '/image.*');

        if (!$files || count($files) === 0) {
            return $this->json(['message' => 'Aucune image trouvée.'], 404);
        }

        $filename = basename($files[0]);
        $imagePath = '/uploads/users/' . $user . '/' . $filename;

        return $this->json([
            'imageUrl' => $imagePath
        ], 200);
    }


    #[Route('/api/getAllTerrainsAndEventCreatedByUser', name: 'get_all_terrains_and_event_created_by_user', methods: ['GET'])]
    public function getAllTerrainsAndEventCreatedByUser(): JsonResponse
    {
        $user = $this->getUser();
        $terrains = $user->getTerrains();
        $events = $user->getEvents();

        return $this->json(['terrains' => $terrains, 'events' => $events], 200, [], ['groups' => ['createdByUser']]);
    }

    /**
     * Attribue les rôles ROLE_TRUSTED et ROLE_PREMIUM à l'utilisateur connecté s'il ne les possède pas déjà.
     * Retourne un message indiquant le résultat de l'opération.
     */
    #[Route('/api/subscribe', name: 'app_subscribe', methods: ['POST'])]
    public function subscribe(): JsonResponse
    {
        $user = $this->getUser();

        $dto = new UserDTO();
        $roles = $user->getRoles();

        $modified = false;

        if (!in_array('ROLE_TRUSTED', $roles)) {
            $roles[] = 'ROLE_TRUSTED';
            $modified = true;
        }

        if (!in_array('ROLE_PREMIUM', $roles)) {
            $roles[] = 'ROLE_PREMIUM';
            $modified = true;
        }

        if ($modified) {
            $dto->roles = $roles;
            $result = $this->userManager->changeRole($dto, $user);
            if ($user->getTrustability() < 100) {
                $this->userManager->plus100($user);
            }
            if (!$result) {
                return $this->json(['message' => 'Erreur lors de l\'attribution des rôles'], 500);
            }
            return $this->json(['message' => 'Rôles attribués avec succès'], 200);
        }

        return $this->json(['message' => 'L\'utilisateur possède déjà les rôles requis'], 200);
    }

    #[Route('/api/unsubscribe', name: 'app_unsubscribe', methods: ['POST'])]
    public function unsubscribe(): JsonResponse
    {
        $user = $this->getUser();

        $dto = new UserDTO();
        $roles = $user->getRoles();

        if (!in_array('ROLE_PREMIUM', $roles)) {
            return $this->json(['message' => 'L\'utilisateur ne possède pas le rôle PREMIUM.'], 200);
        }

        $roles = array_filter($roles, fn($role) => $role !== 'ROLE_PREMIUM');
        $dto->roles = array_values($roles);

        $result = $this->userManager->changeRole($dto, $user);

        if (!$result) {
            return $this->json(['message' => 'Erreur lors de la suppression du rôle PREMIUM.'], 500);
        }

        return $this->json(['message' => 'Rôle PREMIUM retiré avec succès.'], 200);
    }



    #[Route('/api/deleteUser', name: 'app_delete_user', methods: ['DELETE'])]
    public function deleteUser(Request $request, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        if (!isset($data['password'])) {
            return $this->json(['message' => 'Mot de passe requis'], 400);
        }

        if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
            return $this->json(['message' => 'Mot de passe incorrect'], 401);
        }

        $events = $user->getEvents();
        $terrains = $user->getTerrains();

        $result = $this->userManager->deleteUser($user, $terrains, $events);
        if (!$result) {
            return $this->json(['message' => 'Erreur lors de la suppression'], 500);
        }

        return $this->json(['message' => 'Utilisateur supprimé avec succès'], 200);
    }

}
