<?php

namespace App\Controller;

use App\Dto\TerrainDTO;
use App\Entity\Terrain;
use App\Manager\TerrainManager;
use App\Repository\TerrainRepository;
use App\Repository\TypeFiletRepository;
use App\Repository\TypePanierRepository;
use App\Repository\TypeSolRepository;
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
    )
    {

    }
    #[Route('/api/getAllTerrains', name: 'app_get_all_terrains')]
    public function getAllTerrains(): Response
    {
        $terrains = $this->terrainRepository->findAll();

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
    public function addTerrain(Request $request, TerrainManager $terrainManager): JsonResponse
    {
        return $this->handleTerrain($request, $terrainManager);
    }

    #[Route('/api/updateTerrain/{id}', name: 'app_update_terrain', methods: ['POST'])]
    public function updateTerrain(Request $request, TerrainManager $terrainManager, $id): JsonResponse
    {
        $terrain = $this->terrainRepository->find($id);
        if (!$terrain) {
            return $this->json(['message' => 'Terrain non trouvé.'], 404);
        }

        return $this->handleTerrain($request, $terrainManager, $terrain);
    }

    private function handleTerrain(Request $request, TerrainManager $terrainManager, ?Terrain $terrain = null): JsonResponse
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
        $dto->image_url = $data['imageUrl'] ?? null; // correction ici

        $result = $terrain
            ? $terrainManager->updateTerrain($dto, $terrain)
            : $terrainManager->addTerrain($dto);

        if (!$result) {
            return $this->json([
                'message' => $terrain
                    ? 'Erreur lors de la mise à jour du terrain.'
                    : 'Erreur lors de la création du terrain.'
            ], 500);
        }

        return $this->json($result, 200, [], ['groups' => ['terrain']]);
    }

}
