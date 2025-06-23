<?php

namespace App\Repository;

use App\Entity\Terrain;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Terrain>
 */
class TerrainRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Terrain::class);
    }

    //    /**
    //     * @return Terrain[] Returns an array of Terrain objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Terrain
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

//    public function findTerrainsNotVotedByUser(User $user)
//    {
//        return $this->createQueryBuilder('t')
//            ->leftJoin('t.votes', 'v', 'WITH', 'v.user = :user')
//            ->where('t.etat = 0')
//            ->andWhere('v.id IS NULL')
//            ->setParameter('user', $user)
//            ->orderBy('t.created_at', 'ASC')
//            ->getQuery()
//            ->getResult();
//    }

    public function findTerrainsNotVotedByUser(User $user)
    {
        return $this->createQueryBuilder('t')
            ->leftJoin('t.votes', 'v', 'WITH', 'v.user = :user')
            ->where('v.id IS NULL')
            ->andWhere('(t.etat = 0 OR (t.etat = 1 AND t.etat_delete = 0))')
            ->setParameter('user', $user)
            ->orderBy('t.created_at', 'ASC')
            ->getQuery()
            ->getResult();
    }


    public function findPendingTerrainsNotCreatedBy(User $user): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.etat = :etat')
            ->andWhere('t.created_by != :user')
            ->setParameter('etat', 0)
            ->setParameter('user', $user)
            ->orderBy('t.created_at', 'ASC')
            ->getQuery()
            ->getResult();
    }

}
