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
    public function addEvent(EventDTO $eventDTO)
    {
        $newEvent = new Event();
        $this->mapDtoToEvent($eventDTO, $newEvent);

        try {
            $this->em->persist($newEvent);
            $this->em->flush();
            return $newEvent;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function updateEvent(EventDTO $eventDTO, Event $event)
    {
        $this->mapDtoToEvent($eventDTO, $event);

        try {
            $this->em->persist($event);
            $this->em->flush();
            return $event;
        } catch (\Exception $e) {
            return null;
        }
    }

    private function mapDtoToEvent(EventDTO $dto, Event $event): void
    {
        $event->setNom($dto->nom);
        $event->setCreatedBy($dto->created_by);
        $event->setTerrain($dto->terrain);
        $event->setDescription($dto->description);
        $event->setDateHeure(new \DateTimeImmutable($dto->date_heure));
        $event->setMaxJoueurs($dto->max_joueurs);
        $event->setNiveau($dto->niveau);
        $event->setEtat($dto->etat);
        $event->setTypeEvent($dto->type_event);
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
