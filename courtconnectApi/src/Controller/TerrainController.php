<?php

namespace App\Controller;

use App\Dto\TerrainDTO;
use App\Dto\VoteDTO;
use App\Entity\Terrain;
use App\Manager\TerrainManager;
use App\Manager\VoteManager;
use App\Repository\TerrainRepository;
use App\Repository\TypeFiletRepository;
use App\Repository\TypePanierRepository;
use App\Repository\TypeSolRepository;
use App\Repository\VoteRepository;
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
    )
    {

    }
    #[Route('/api/getAllValidatedTerrains', name: 'app_get_all_validated_terrains', methods: ['GET'])]
    public function getAllValidatedTerrains(): Response
    {
        $terrains = $this->terrainRepository->findBy(['etat' => 1], ['created_at' => 'DESC']);

        return $this->json($terrains, 200, [], ['groups' => ['terrain']]);
    }

    #[Route('/api/getAllPendingTerrains', name: 'app_get_all_pending_terrains', methods: ['GET'])]
    public function getAllPendingTerrains(): Response
    {
        $terrains = $this->terrainRepository->findBy(['etat' => 0], ['created_at' => 'ASC']);

        return $this->json($terrains, 200, [], ['groups' => ['terrain']]);
    }

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



    #[Route('/api/addTerrain', name: 'app_add_terrain', methods: ['POST'])]
    public function addTerrain(Request $request): JsonResponse
    {
        return $this->handleTerrain($request);
    }

    #[Route('/api/updateTerrain/{id}', name: 'app_update_terrain', methods: ['POST'])]
    public function updateTerrain(Request $request, $id): JsonResponse
    {
        $terrain = $this->terrainRepository->find($id);
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
        $dto->image_url = $data['imageUrl'] ?? null;

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
        return $this->handleTerrainEtatChange($id, 1, $this->terrainManager);
    }

    #[Route('/api/terrain/{id}/refuse', name: 'app_refuse_terrain', methods: ['POST'])]
    public function refuseTerrain($id): Response
    {
        return $this->handleTerrainEtatChange($id, 2, $this->terrainManager);
    }

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

    public function changeEtatTerrain(int $id, TerrainManager $terrainManager): JsonResponse
    {
        $terrain = $this->terrainRepository->find($id);
        if (!$terrain) {
            return $this->json(['message' => "Terrain non trouvé."], 500);
        }

        $terrainDto = new TerrainDTO();
        $result = null;

        if ($terrain->getVoteValide() >= 3) {
            $terrainDto->etat = 1;
            $result = $terrainManager->changeEtatTerrain($terrain, $terrainDto);
        } elseif ($terrain->getVoteRefuse() >= 3) {
            $terrainManager->deleteTerrain($terrain);
            $result = true;
        } else {
            return $this->json(['message' => "Le terrain n’a pas encore atteint le seuil de vote requis."], 200);
        }

        if (!$result) {
            return $this->json(['message' => "Erreur lors du changement d'état du terrain."], 500);
        }

        return $this->json(['message' => "L'état du terrain a été mis à jour avec succès."], 200);
    }

    public function hasUserVoted($user, Terrain $terrain): bool
    {
        return $this->voteRepository->findOneBy([
                'user' => $user,
                'terrain' => $terrain
            ]) !== null;
    }


}
