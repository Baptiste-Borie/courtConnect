<?php

namespace App\Manager;

use App\Dto\VoteDTO;
use App\Entity\Terrain;
use App\Entity\User;
use App\Entity\Vote;
use Doctrine\ORM\EntityManagerInterface;

class VoteManager
{
    public function __construct(private EntityManagerInterface $em)
    {

    }
    public function addVote(VoteDTO $voteDTO, $user, Terrain $terrain)
    {
        $vote = new Vote();
        $vote->setUser($user);
        $vote->setTerrain($terrain);
        $vote->setResultat($voteDTO->resultat);

        try {
            $this->em->persist($vote);
            $this->em->flush();
            return $vote;
        } catch (\Exception $e) {
            return null;
        }
    }

}
