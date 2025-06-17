<?php

namespace App\Controller;

use App\Dto\UserDTO;
use App\Entity\User;
use App\Manager\UserManager;
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
}
