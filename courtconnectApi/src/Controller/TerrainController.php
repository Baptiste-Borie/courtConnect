<?php

namespace App\Controller;

use App\Dto\TerrainDTO;
use App\Dto\VoteDTO;
use App\Entity\Terrain;
use App\Entity\User;
use App\Manager\TerrainManager;
use App\Manager\VoteManager;
use App\Repository\EventRepository;
use App\Repository\TerrainRepository;
use App\Repository\TypeFiletRepository;
use App\Repository\TypePanierRepository;
use App\Repository\TypeSolRepository;
use App\Repository\VoteRepository;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TerrainController extends AbstractController
{
    public function __construct(private TerrainRepository $terrainRepository,
                                private TypeSolRepository $typeSolRepository,
                                private TypePanierRepository $typePanierRepository,
                                private TypeFiletRepository $typeFiletRepository,
                                private VoteManager $voteManager,
                                private TerrainManager $terrainManager,
                                private VoteRepository $voteRepository,
                                private EventRepository $eventRepository,
    )
    {

    }

    /**
     * Récupère tous les terrains validés (état = 1) triés par date de création décroissante
     *
     * @return JsonResponse 200: Liste des terrains validés formatés selon le groupe de sérialisation 'terrain'
     *
     */
    #[Route('/getAllValidatedTerrains', name: 'app_get_all_validated_terrains', methods: ['GET'])]
    public function getAllValidatedTerrains(): Response
    {
        $terrains = $this->terrainRepository->findBy(['etat' => 1], ['created_at' => 'DESC']);

        return $this->json($terrains, 200, [], ['groups' => ['terrain']]);
    }


    /**
     * Récupère tous les terrains en attente de validation (état = 0)
     *
     * Les résultats sont triés par date de création ascendante
     *
     * @return JsonResponse
     *   - 200: Liste des terrains en attente
     */
    #[Route('/api/getAllPendingTerrains', name: 'app_get_all_pending_terrains', methods: ['GET'])]
    public function getAllPendingTerrains(): Response
    {
        $user = $this->getUser();
        $terrains = $this->terrainRepository->findPendingTerrainsNotCreatedBy($user);

        return $this->json($terrains, 200, [], ['groups' => ['terrain']]);
    }


    /**
     * Récupère tous les terrains pour lesquels l'utilisateur connecté n'a pas encore voté
     *
     * @return JsonResponse
     *   - 200: Liste des terrains non votés
     *   - 401: Utilisateur non authentifié
     *
     * @throws Exception Si une erreur survient lors de la récupération des terrains
     */
    #[Route('/api/getAllNoVotedTerrains', name: 'app_get_all_no_voted_terrains', methods: ['GET'])]
    public function getAllNoVotedTerrains(): Response
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $terrains = $this->terrainRepository->findTerrainsNotVotedByUser($user);

        return $this->json($terrains, 200, [], ['groups' => ['terrain']]);
    }


    #[Route('/api/getTerrain/{id}', name: 'app_get_terrain_by_id', methods: ['GET'])]
    public function getTerrainById(int $id): JsonResponse
    {
        $terrain = $this->terrainRepository->find($id);

        if (!$terrain) {
            return $this->json(['message' => 'Terrain non trouvé'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($terrain, Response::HTTP_OK, [], ['groups' => ['terrain']]);
    }

    #[Route('/api/getAllFavoriteTerrains', name: 'app_get_all_favorite_terrains', methods: ['GET'])]
    public function getAllFavoriteTerrains(): JsonResponse
    {
        $user = $this->getUser();
        $roles = $user->getRoles();
        $terrains = $user->getFavori();
        if (!in_array('ROLE_PREMIUM', $roles)) {
            return $this->json(['message' => 'Accès refusé. Rôle PREMIUM requis.'], 403);
        }
        return $this->json($terrains, 200, [], ['groups' => ['terrain']]);
    }

    #[Route('/api/getTerrainCreatedByUser', name: 'app_get_terrain_created_by_user', methods: ['GET'])]
    public function getTerrainCreatedByUser(): JsonResponse
    {
        $user = $this->getUser();
        $terrains = $this->terrainRepository->findBy(['created_by' => $user]);
        $terrainsCount = count($terrains);

        return $this->json($terrainsCount, 200);
    }

    /**
     * Ajoute un terrain aux favoris de l'utilisateur connecté.
     * Accessible uniquement aux utilisateurs ayant le rôle ROLE_PREMIUM.
     * Vérifie si le terrain existe et s'il n'est pas déjà dans les favoris.
     *
     * @param int $id L'identifiant du terrain à ajouter en favori.
     * @return JsonResponse Réponse JSON indiquant le résultat de l'opération.
     */
    #[Route('/api/addTerrainToFavorite/{id}', name: 'app_add_terrain_to_favorite', methods: ['POST'])]
    public function addTerrainToFavorite(int $id): JsonResponse
    {
        $user = $this->getUser();
        $roles = $user->getRoles();
        $terrain = $this->terrainRepository->find($id);

        if (!$terrain) {
            return $this->json(['message' => 'Terrain introuvable.'], 404);
        }

        if (!in_array('ROLE_PREMIUM', $roles)) {
            return $this->json(['message' => 'Accès refusé. Rôle PREMIUM requis.'], 403);
        }

        $favoris = $user->getFavori();

        if ($favoris->contains($terrain)) {
            return $this->json(['message' => 'Terrain déjà dans les favoris.'], 500);
        }

        $result = $this->terrainManager->addFavorite($terrain, $user);
        if (!$result) {
            return $this->json(['message' => 'Erreur lors de l\'ajout aux favoris.'], 500);
        }

        return $this->json(['message' => 'Ajout aux favoris avec succès.'], 200);
    }

    /**
     * Supprime un terrain des favoris de l'utilisateur connecté.
     * Accessible uniquement aux utilisateurs ayant le rôle ROLE_PREMIUM.
     * Vérifie que le terrain existe et qu'il est bien dans les favoris avant suppression.
     *
     * @param int $id L'identifiant du terrain à supprimer des favoris.
     * @return JsonResponse Réponse JSON indiquant le résultat de l'opération.
     */
    #[Route('/api/deleteTerrainFromFavorite/{id}', name: 'app_add_terrain_from_favorite', methods: ['POST'])]
    public function deleteTerrainFromFavorite(int $id): JsonResponse
    {
        $user = $this->getUser();
        $roles = $user->getRoles();
        $favoris = $user->getFavori();
        $terrain = $this->terrainRepository->find($id);
        if (!$terrain) {
            return $this->json(['message' => 'Terrain introuvable.'], 404);
        }
        if (!$favoris->contains($terrain)) {
            return $this->json(['message' => 'Terrain introuvable dans les favoris'], 403);
        }
        if (!in_array('ROLE_PREMIUM', $roles)) {
            return $this->json(['message' => 'Accès refusé. Rôle PREMIUM requis.'], 403);
        }
        $result = $this->terrainManager->deleteTerrainFromFavorite($user, $terrain);
        if (!$result) {
            return $this->json(['message' => 'Erreur lors de la supression des favoris.'], 500);
        }

        return $this->json(['message' => 'Supression des favoris avec succès.'], 200);
    }


    #[Route('/api/addTerrain', name: 'app_add_terrain', methods: ['POST'])]
    public function addTerrain(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $roles = $user->getRoles();
        $terrains = $this->terrainRepository->findBy(['created_by' => $user]);
        $terrainCount = count($terrains);

        if (in_array('ROLE_PREMIUM', $roles) || in_array('ROLE_TRUSTED', $roles)) {
            return $this->handleTerrain($request);
        }

        if (in_array('ROLE_USER', $roles)) {
            if ($terrainCount >= 1) {
                return $this->json(['message' => 'Limite de 1 terrain atteinte pour les utilisateurs standard.'], 403);
            }
            return $this->handleTerrain($request);
        }

        return $this->json(['message' => 'Rôle utilisateur non reconnu.'], 403);
    }


    #[Route('/api/updateTerrain/{id}', name: 'app_update_terrain', methods: ['POST'])]
    public function updateTerrain(Request $request, $id): JsonResponse
    {
        $user = $this->getUser();
        $terrain = $this->terrainRepository->find($id);
        if ($user !== $terrain->getCreatedBy()) {
            return $this->json(['message' => 'Vous n\'etes pas le créateur.'], 404);
        }
        if (!$terrain) {
            return $this->json(['message' => 'Terrain non trouvé.'], 404);
        }

        return $this->handleTerrain($request, $terrain);
    }

    /**
     * Crée ou met à jour un terrain selon que l'entité $terrain est fournie ou non.
     *
     * Cette méthode récupère les données JSON envoyées dans la requête, les mappe dans un DTO,
     * puis délègue la création ou la mise à jour du terrain au TerrainManager.
     *
     * @param Request $request La requête HTTP contenant les données du terrain au format JSON.
     * @param Terrain|null $terrain L'entité Terrain à mettre à jour, ou null pour une création.
     *
     * @return JsonResponse Réponse JSON contenant le terrain créé ou mis à jour, ou un message d’erreur.
     */
    private function handleTerrain(Request $request, ?Terrain $terrain = null): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }
        if (!$data) {
            return $this->json(['message' => 'Invalid JSON'], 400);
        }

        $dto = new TerrainDTO();
        $dto->nom = $data['nom'];
        $dto->adresse = $data['adresse'];
        $dto->ville = $data['ville'];
        $dto->codePostal = $data['codePostal'];
        $dto->latitude = $data['latitude'];
        $dto->longitude = $data['longitude'];
        $dto->nbPanier = $data['nbPanier'];
        $dto->typeSol = $this->typeSolRepository->find($data['typeSol']);
        $dto->typeFilet = $this->typeFiletRepository->find($data['typeFilet']);
        $dto->typePanier = $this->typePanierRepository->find($data['typePanier']);
        $dto->spectateur = $data['spectateur'];
        $dto->createdBy = $user;
        $dto->remarque = $data['remarque'];
        $dto->usure = $data['usure'];

        $result = $terrain
            ? $this->terrainManager->updateTerrain($dto, $terrain)
            : $this->terrainManager->addTerrain($dto);

        if (!$result) {
            return $this->json([
                'message' => $terrain
                    ? 'Erreur lors de la mise à jour du terrain.'
                    : 'Erreur lors de la création du terrain.'
            ], 500);
        }

        return $this->json($result, 200, [], ['groups' => ['terrain']]);
    }


    #[Route('/api/terrain/{id}/validate', name: 'app_validate_terrain', methods: ['POST'])]
    public function validateTerrain($id): Response
    {
        return $this->handleTerrainEtatChange($id, 1);
    }

    #[Route('/api/terrain/{id}/refuse', name: 'app_refuse_terrain', methods: ['POST'])]
    public function refuseTerrain($id): Response
    {
        return $this->handleTerrainEtatChange($id, 2);
    }


    /**
     * Gère le changement d'état d'un terrain via un vote utilisateur
     *
     * @param mixed $id ID du terrain
     * @param int $etat État du vote (1 = validé, autre = refusé)
     * @return Response
     *   - 200: Vote enregistré avec succès
     *   - 500: Erreur lors du traitement
     *
     * @throws Exception Si l'utilisateur a déjà voté ou si le terrain n'existe pas
     */
    private function handleTerrainEtatChange($id, int $etat): Response
    {
        $terrain = $this->terrainRepository->find($id);
        if (!$terrain) {
            return $this->json(['message' => 'Terrain non trouvé.'], 500);
        }
        $hasVoted = $this->hasUserVoted($this->getUser(), $terrain);
        if ($hasVoted) {
            return $this->json(['message' => 'Vous avez deja voter pour ce terrain.'], 500);
        }

        $dto = new TerrainDTO();
        if ($terrain->getEtat() === 1 && ($terrain->getEtatDelete() !== 0 || $terrain->getEtatDelete() === null)) {
            $dto->etatDelete = 0;
        }
        if ($etat === 1) {
            $dto->voteValide = 1;
        } else {
            $dto->voteRefuse = 1;
        }

        $voteDto = new VoteDTO();
        $voteDto->resultat = $etat;
        $result = $this->terrainManager->incrementVote($dto, $terrain);
        $vote = $this->voteManager->addVote($voteDto, $this->getUser(), $terrain);

        if (!$result) {
            return $this->json(['message' => "Erreur lors du changement d'état du terrain."], 500);
        }
        if (!$vote) {
            return $this->json(['message' => "Erreur lors de l'enregistrement du vote."], 500);
        }
        $this->changeEtatTerrain($id, $this->terrainManager);
        $message = $etat === 1 ? 'Vote de validation enregistré.' : 'Vote de refus enregistré.';
        return $this->json(['message' => $message], 200);
    }


    /**
     * Change l'état d'un terrain en fonction des votes reçus
     *
     * - Valide le terrain (état = 1) si 3 votes valides ou plus
     * - Supprime le terrain si 3 votes refusés ou plus
     *
     * - si le terrain est deja validé (etat = 1), les votes concerneront la suppression du terrain
     * - Le terrain est supprimé si 3 votes valides
     * - réinitialisation des votes si 3 votes refus
     *
     * @param int $id ID du terrain à modifier
     * @param TerrainManager $terrainManager Service de gestion des terrains
     * @return JsonResponse
     *   - 200: Succès ou seuil non atteint
     *   - 500: Erreur ou terrain non trouvé
     */
    public function changeEtatTerrain(int $id, TerrainManager $terrainManager): JsonResponse
    {
        $terrain = $this->terrainRepository->find($id);
        if (!$terrain) {
            return $this->json(['message' => "Terrain non trouvé."], 404);
        }

        $terrainDto = new TerrainDTO();
        $result = null;

        if ($terrain->getVoteValide() >= 3 && $terrain->getEtat() === 0) {
            $terrainDto->etat = 1;
            $result = $terrainManager->changeEtatTerrain($terrain, $terrainDto);
            $this->deleteVote($terrain);
        } elseif ($terrain->getVoteRefuse() >= 3 && $terrain->getEtat() === 0) {
            $this->deleteVote($terrain);
            $result = $terrainManager->deleteTerrain($terrain);
        } elseif ($terrain->getVoteValide() >= 3 && $terrain->getEtat() === 1) {
            $this->deleteVote($terrain);
            $events = $this->eventRepository->findBy(['terrain' => $terrain, 'etat' => [0,1]]);
            $result = $terrainManager->deleteTerrain($terrain, $events);
        } elseif ($terrain->getVoteRefuse() >= 3 && $terrain->getEtat() === 1) {
            $terrainDto->etatDelete = null;
            $result = $terrainManager->changeEtatTerrain($terrain, $terrainDto);
            $this->deleteVote($terrain);
        } else {
            return $this->json(['message' => "Le terrain n’a pas encore atteint le seuil de vote requis."], 200);
        }

        if (!$result) {
            return $this->json(['message' => "Erreur lors du changement d'état du terrain."], 500);
        }

        return $this->json(['message' => "L'état du terrain a été mis à jour avec succès."], 200);
    }



    /**
     * Vérifie si un utilisateur a déjà voté pour un terrain donné
     *
     * @param User $user L'utilisateur à vérifier
     * @param Terrain $terrain Le terrain concerné
     * @return bool True si l'utilisateur a déjà voté, false sinon
     */
    public function hasUserVoted(User $user, Terrain $terrain): bool
    {
        return $this->voteRepository->findOneBy([
                'user' => $user,
                'terrain' => $terrain
            ]) !== null;
    }


    /**
     * Upload et enregistre l'image de profil d'un terrain donné.
     *
     * @param Request $request Requête HTTP contenant le fichier image.
     * @param int $id Identifiant du terrain auquel l'image est associée.
     *
     * @return JsonResponse Réponse JSON indiquant le succès ou l'échec de l'opération.
     */
    #[Route('/api/uploadTerrainPicture/{id}', name: 'upload_terrain_picture', methods: ['POST'])]
    public function uploadProfilePicture(Request $request, $id): JsonResponse
    {
        $file = $request->files->get('image');

        if (!$file || !$file->isValid()) {
            return $this->json(['message' => 'Image invalide.'], 400);
        }

        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/terrains/' . $id;

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
    #[Route('/api/terrain/{id}/getPicture', name: 'get_terrain_picture', methods: ['GET'])]
    public function getProfilePictureUrl($id): JsonResponse
    {
        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/terrains/' . $id;
        $files = glob($uploadDir . '/image.*');

        if (!$files || count($files) === 0) {
            return $this->json(['message' => 'Aucune image trouvée.'], 404);
        }

        $filename = basename($files[0]);
        $imagePath = '/uploads/terrains/' . $id . '/' . $filename;

        return $this->json([
            'imageUrl' => $imagePath
        ], 200);
    }

    /**
     * Supprime les votes lié au terrain
     *
     * @param Terrain $terrain
     * @return JsonResponse
     */
    public function deleteVote(Terrain $terrain): JsonResponse
    {
        $result = $this->terrainManager->deleteVotes($terrain);
        if (!$result) {
            return $this->json(['message' => 'Erreur lors de la suppression des votes.'], 404);
        }
        return $this->json(['message' => 'Votes supprimés avec succes.'], 200);
    }


}
