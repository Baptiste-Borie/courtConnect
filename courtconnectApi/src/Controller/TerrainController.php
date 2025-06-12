<?php

namespace App\Controller;

use App\Dto\TerrainDTO;
use App\Entity\Terrain;
use App\Manager\TerrainManager;
use App\Repository\TerrainRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TerrainController extends AbstractController
{
    public function __construct(private TerrainRepository $terrainRepository, private TerrainDTO $terrainDTO)
    {

    }
    #[Route('/api/getAllTerrains', name: 'app_terrain')]
    public function getAll(): Response
    {
        $terrain = $this->terrainRepository->findAll();

        return $this->json($terrain, 200, [], ['groups' => ['terrain']]);
    }


    #[Route('/api/addTerrain', name: 'app__add_terrain', methods: ['POST'])]
    public function addTerrain(Request $request, TerrainManager $terrainManager): JsonResponse
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
        $dto->sol = $data['sol'];
        $dto->nbPanier = $data['nbPanier'];
        $dto->typeFilet = $data['typeFilet'];
        $dto->typePanier = $data['typePanier'];
        $dto->spectateur = $data['spectateur'];
        $dto->createdBy = $user;
        $dto->remarque = $data['remarque'];
        $dto->usure = $data['usure'];

        $terrain = $terrainManager->addTerrain($dto);

        if (!$terrain) {
            return $this->json(['message' => 'Erreur lors de la création du terrain.'], 500);
        }

        return $this->json($terrain, 200, [], ['groups' => ['terrain']]);
    }
}
