<?php

namespace App\Manager;

use App\Dto\TerrainDTO;
use App\Entity\Terrain;
use App\Entity\User;
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
        $newTerrain->setTypeSol($terrainDTO->typeSol);
        $newTerrain->setNbPanier($terrainDTO->nbPanier);
        $newTerrain->setTypeFilet($terrainDTO->typeFilet);
        $newTerrain->setTypePanier($terrainDTO->typePanier);
        $newTerrain->setUsure($terrainDTO->usure);
        $newTerrain->setSpectateur($terrainDTO->spectateur);
        $newTerrain->setCreatedBy($terrainDTO->createdBy);
        $newTerrain->setEtat(0);
        $newTerrain->setRemarque($terrainDTO->remarque);

        try {
            $this->em->persist($newTerrain);
            $this->em->flush();
            return $newTerrain;
        } catch (\Exception $e) {
            return null;
        }

    }

    public function updateTerrain(TerrainDTO $terrainDTO, Terrain $terrain) {

        $terrain->setNom($terrainDTO->nom);
        $terrain->setAdresse($terrainDTO->adresse);
        $terrain->setVille($terrainDTO->ville);
        $terrain->setCodePostal($terrainDTO->codePostal);
        $terrain->setLatitude($terrainDTO->latitude);
        $terrain->setLongitude($terrainDTO->longitude);
        $terrain->setTypeSol($terrainDTO->typeSol);
        $terrain->setNbPanier($terrainDTO->nbPanier);
        $terrain->setTypeFilet($terrainDTO->typeFilet);
        $terrain->setTypePanier($terrainDTO->typePanier);
        $terrain->setUsure($terrainDTO->usure);
        $terrain->setSpectateur($terrainDTO->spectateur);
        $terrain->setCreatedBy($terrainDTO->createdBy);
        $terrain->setRemarque($terrainDTO->remarque);

        try {
            $this->em->persist($terrain);
            $this->em->flush();
            return $terrain;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function incrementVote(TerrainDTO $terrainDto, Terrain $terrain)
    {
        if ($terrainDto->voteValide) {
            $terrain->setVoteValide($terrain->getVoteValide() + 1);
        }

        if ($terrainDto->voteRefuse) {
            $terrain->setVoteRefuse($terrain->getVoteRefuse() + 1);
        }

        try {
            $this->em->persist($terrain);
            $this->em->flush();
            return $terrain;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function changeEtatTerrain(Terrain $terrain, TerrainDTO $terrainDTO)
    {
        $terrain->setEtat($terrainDTO->etat);
        try {
            $this->em->persist($terrain);
            $this->em->flush();
            return $terrain;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function deleteTerrain(Terrain $terrain)
    {
        $this->em->remove($terrain);
        $this->em->flush();

    }

    public function deleteVotes($votes)
    {
        foreach ($votes as $vote) {
            $this->em->remove($vote);
        }
        try {
            $this->em->flush();
            return true;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function addFavorite(Terrain $terrain, User $user)
    {
        $user->addFavori($terrain);
        try {
            $this->em->flush();
            return $terrain;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function deleteTerrainFromFavorite($user, $terrain)
    {
        $user->removeFavori($terrain);
        try {
            $this->em->flush();
            return true;
        } catch (\Exception $e) {
            return null;
        }
    }
}
