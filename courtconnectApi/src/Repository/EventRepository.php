<?php

namespace App\Repository;

use App\Entity\Event;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Event>
 */
class EventRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Event::class);
    }

    //    /**
    //     * @return Event[] Returns an array of Event objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('e')
    //            ->andWhere('e.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('e.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Event
    //    {
    //        return $this->createQueryBuilder('e')
    //            ->andWhere('e.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function findEventsWithEtatZeroOrOne()
    {
        return $this->createQueryBuilder('e')
            ->where('e.etat IN (:etats)')
            ->setParameter('etats', [0, 1])
            ->orderBy('e.date_heure', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findEventsWithEtatZeroOrOneOfTerrain($terrainId)
    {
        return $this->createQueryBuilder('e')
            ->where('e.etat IN (:etats)')
            ->andWhere('e.terrain = :terrainId')
            ->setParameter('etats', [0, 1])
            ->setParameter('terrainId', $terrainId)
            ->orderBy('e.date_heure', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findEventsJoinedByUser($user)
    {
        return $this->createQueryBuilder('e')
            ->innerJoin('e.joueurs', 'j')
            ->where('j = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->getResult();
    }

}
