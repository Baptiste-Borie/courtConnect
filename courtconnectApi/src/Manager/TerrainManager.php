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
    public function addTerrain(TerrainDTO $terrainDTO)
    {
        $terrain = new Terrain();
        $terrain->setCreatedAt(new \DateTimeImmutable());
        $terrain->setEtat(0);

        return $this->saveOrUpdateTerrainFromDTO($terrain, $terrainDTO);
    }

    public function updateTerrain(TerrainDTO $terrainDTO, Terrain $terrain)
    {
        return $this->saveOrUpdateTerrainFromDTO($terrain, $terrainDTO);
    }

    private function saveOrUpdateTerrainFromDTO(Terrain $terrain, TerrainDTO $dto)
    {
        $terrain->setNom($dto->nom);
        $terrain->setAdresse($dto->adresse);
        $terrain->setVille($dto->ville);
        $terrain->setCodePostal($dto->codePostal);
        $terrain->setLatitude($dto->latitude);
        $terrain->setLongitude($dto->longitude);
        $terrain->setTypeSol($dto->typeSol);
        $terrain->setNbPanier($dto->nbPanier);
        $terrain->setTypeFilet($dto->typeFilet);
        $terrain->setTypePanier($dto->typePanier);
        $terrain->setUsure($dto->usure);
        $terrain->setSpectateur($dto->spectateur);
        $terrain->setCreatedBy($dto->createdBy);
        $terrain->setRemarque($dto->remarque);

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
        if (isset($terrainDto->etatDelete)) {
            $terrain->setEtatDelete($terrainDto->etatDelete);
        }
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
        if (isset($terrainDTO->etat)) {
            $terrain->setEtat($terrainDTO->etat);
        }

        if (array_key_exists('etatDelete', get_object_vars($terrainDTO))) {
            $terrain->setEtatDelete($terrainDTO->etatDelete);
        }

        try {
            $this->em->persist($terrain);
            $this->em->flush();
            return $terrain;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function deleteTerrain(Terrain $terrain, $events = null): bool
    {
        if ($events) {
            foreach ($events as $event) {
                $event->setEtat(3);
            }
        }
        try {
            $this->em->remove($terrain);
            $this->em->flush();
            return true;
        } catch (\Exception $e) {
            dd('Erreur suppression : ' . $e->getMessage());
            return false;
        }
    }


    public function deleteVotes(Terrain $terrain): bool
    {
        $terrain->setVoteValide(null);
        $terrain->setVoteRefuse(null);

        try {
            $terrain->getVotes()->clear();

            $this->em->persist($terrain);
            $this->em->flush();

            return true;
        } catch (\Exception $e) {
            dd('Erreur suppression : ' . $e->getMessage());
            return false;
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
