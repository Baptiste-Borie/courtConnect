<?php

namespace App\Manager;

use App\Dto\EventDTO;
use App\Dto\UserDTO;
use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;

class EventManager
{

    public function __construct(private EntityManagerInterface $em)
    {

    }
    public function addEvent(EventDTO $eventDTO) {
        $newEvent = new Event();

        $newEvent->setNom($eventDTO->nom);
        $newEvent->setCreatedBy($eventDTO->created_by);
        $newEvent->setTerrain($eventDTO->terrain);
        $newEvent->setDescription($eventDTO->description);
        $newEvent->setDateHeure(new \DateTimeImmutable($eventDTO->date_heure));
        $newEvent->setMaxJoueurs($eventDTO->max_joueurs);
        $newEvent->setNiveau($eventDTO->niveau);
        $newEvent->setEtat($eventDTO->etat);
        $newEvent->setTypeEvent($eventDTO->type_event);

        try {
            $this->em->persist($newEvent);
            $this->em->flush();
            return $newEvent;
        } catch (\Exception $e) {
            return null;
        }

    }

    public function updateEvent(EventDTO $eventDTO, Event $event) {

        $event->setNom($eventDTO->nom);
        $event->setCreatedBy($eventDTO->created_by);
        $event->setTerrain($eventDTO->terrain);
        $event->setDescription($eventDTO->description);
        $event->setDateHeure(new \DateTimeImmutable($eventDTO->date_heure));
        $event->setMaxJoueurs($eventDTO->max_joueurs);
        $event->setNiveau($eventDTO->niveau);
        $event->setEtat($eventDTO->etat);
        $event->setTypeEvent($eventDTO->type_event);

        try {
            $this->em->persist($event);
            $this->em->flush();
            return $event;
        } catch (\Exception $e) {
            return null;
        }

    }

    public function joinEvent(EventDTO $eventDTO, Event $event) {
        if ($event->getJoueurs()->contains($eventDTO->joueur)) {
            return null;
        }
        $event->addJoueur($eventDTO->joueur);
        try {
            $this->em->persist($event);
            $this->em->flush();
            return $event;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function leaveEvent(EventDTO $eventDTO, Event $event): ?Event
    {
        if (!$event->getJoueurs()->contains($eventDTO->joueur)) {
            return null;
        }

        $event->removeJoueur($eventDTO->joueur);

        try {
            $this->em->persist($event);
            $this->em->flush();
            return $event;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function changeState(EventDTO $eventDTO, $event) {
        $event->setEtat($eventDTO->etat);
        try {
            $this->em->persist($event);
            $this->em->flush();
            return $event;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function givePoints(EventDTO $dto, $participants)
    {
        foreach ($participants as $participant) {
            $participant->setTrustability($participant->getTrustability() + 5);
            $this->em->persist($participant);
        }
        $createur = $dto->created_by;
        $createur->setTrustability($createur->getTrustability() + 5);
        $this->em->persist($createur);
        try {
            $this->em->flush();
            return $createur;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function deleteEvent(Event $event) {
        try {
            $this->em->remove($event);
            $this->em->flush();
            return true;
        } catch (\Exception $e) {
            return null;
        }
    }


}
