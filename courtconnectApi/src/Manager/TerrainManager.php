<?php

namespace App\Manager;

use App\Dto\TerrainDTO;
use App\Entity\Terrain;
use Doctrine\ORM\EntityManagerInterface;

class TerrainManager
{

    public function __construct(private EntityManagerInterface $em)
    {

    }
    public function addTerrain(TerrainDTO $terrainDTO) {
        $newTerrain = new Terrain();

        $newTerrain->setNom($terrainDTO->nom);
        $newTerrain->setAdresse($terrainDTO->adresse);
        $newTerrain->setVille($terrainDTO->ville);
        $newTerrain->setCodePostal($terrainDTO->codePostal);
        $newTerrain->setLatitude($terrainDTO->latitude);
        $newTerrain->setLongitude($terrainDTO->longitude);
        $newTerrain->setCreatedAt(new \DateTimeImmutable());
        $newTerrain->setSol($terrainDTO->sol);
        $newTerrain->setNbPanier($terrainDTO->nbPanier);
        $newTerrain->setTypeFilet($terrainDTO->typeFilet);
        $newTerrain->setTypePanier($terrainDTO->typePanier);
        $newTerrain->setUsure($terrainDTO->usure);
        $newTerrain->setSpectateur($terrainDTO->spectateur);
        $newTerrain->setCreatedBy($terrainDTO->createdBy);
        $newTerrain->setEtat(0);
        $newTerrain->setRemarque($terrainDTO->remarque);

        $this->em->persist($newTerrain);
        $this->em->flush();

        try {
            $this->em->persist($newTerrain);
            $this->em->flush();
            return $newTerrain;
        } catch (\Exception $e) {
            return null;
        }

    }
}
