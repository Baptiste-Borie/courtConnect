<?php

namespace App\Controller;

use App\Dto\EventDTO;
use App\Entity\Event;
use App\Manager\EventManager;
use App\Repository\EventRepository;
use App\Repository\TerrainRepository;
use App\Repository\TypeEventRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class EventController extends AbstractController
{
    public function __construct(private EventRepository $eventRepository,
                                private TypeEventRepository $typeEventRepository,
                                private TerrainRepository $terrainRepository,
                                private EventManager $eventManager,
                                private EntityManagerInterface $em,

    )
    {

    }
    #[Route('/api/getAllEvents', name: 'app_terrain')]
    public function getAll(): Response
    {
        $events = $this->eventRepository->findAll();
        $this->checkEventState();

        return $this->json($events, 200, [], ['groups' => ['all_events']]);
    }

    #[Route('/api/getUsersOfThisEvent/{id}', name: 'app_get_users_of_this_event', methods: ['GET'])]
    public function getUsersOfThisEvent($id): JsonResponse
    {
        $event = $this->eventRepository->find($id);
        if (!$event) {
            return $this->json(['message' => 'Aucun événement trouvé'], 404);
        }

        $users = $event->getJoueurs();
        return $this->json($users, 200, [], ['groups' => ['userOfEvent']]);
    }

    /**
     * Met à jour l'état des événements en fonction de leur date
     *
     * - État 1 (En cours) si l'événement a lieu aujourd'hui
     * - État 2 (Terminé) si l'événement est passé et date d'un autre jour
     */
    public function checkEventState(): void
    {
        $events = $this->eventRepository->findAll();
        $now = new \DateTime('now');
        $today = $now->format('Y-m-d');
        foreach ($events as $event) {
            $eventDate = $event->getDateHeure();
            $eventDay = $eventDate->format('Y-m-d');
            if ($eventDate < $now) {
                $etat = $eventDay === $today ? 1 : 2;
                $event->setEtat($etat);
                $this->em->persist($event);
            }
        }

        $this->em->flush();
    }




    #[Route('/api/getEvent/{id}', name: 'app_get_event_by_id', methods: ['GET'])]
    public function getEventById(int $id): JsonResponse
    {
        $event = $this->eventRepository->find($id);

        if (!$event) {
            return $this->json(['message' => 'Evenement non trouvé'], 404);
        }

        return $this->json($event, Response::HTTP_OK, [], ['groups' => ['all_events']]);
    }


    #[Route('/api/addEvent', name: 'app_add_event', methods: ['POST'])]
    public function addEvent(Request $request): JsonResponse
    {
        return $this->handleEvent($request);
    }

    #[Route('/api/updateEvent/{id}', name: 'app_update_event', methods: ['POST'])]
    public function updateEvent(Request $request, $id): JsonResponse
    {
        $event = $this->eventRepository->find($id);
        if (!$event) {
            return $this->json(['message' => 'Événement non trouvé.'], 404);
        }

        return $this->handleEvent($request, $event);
    }

    /**
     * Gère la création ou la mise à jour d'un événement.
     *
     * @param Request $request         La requête HTTP contenant les données JSON de l'événement.
     * @param Event|null $event        L'événement à mettre à jour, ou null pour en créer un nouveau.
     *
     * @return JsonResponse           Réponse JSON contenant l'événement créé/mis à jour ou un message d'erreur.
     */
    private function handleEvent(Request $request, ?Event $event = null): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }
        if (!$data) {
            return $this->json(['message' => 'Invalid JSON'], 400);
        }

        $dto = new EventDTO();
        $dto->created_by = $user;
        $dto->terrain = $this->terrainRepository->findOneBy(['id' => $data['terrain']]);
        $dto->nom = $data['nom'];
        $dto->description = $data['description'];
        $dto->date_heure = $data['dateHeure'];
        $dto->max_joueurs = $data['maxJoueurs'];
        $dto->niveau = $data['niveau'];
        $dto->etat = 0;
        $dto->type_event = $this->typeEventRepository->findOneBy(['id' => $data['typeEvent']]);

        $result = $event
            ? $this->eventManager->updateEvent($dto, $event)
            : $this->eventManager->addEvent($dto);

        if (!$result) {
            return $this->json([
                'message' => $event
                    ? 'Erreur lors de la mise à jour de l\'événement.'
                    : 'Erreur lors de la création de l\'événement.'
            ], 500);
        }

        return $this->json($result, 200, [], ['groups' => ['all_events']]);
    }

    /**
     * Permet à un utilisateur de rejoindre un événement
     *
     * @param int $id ID de l'événement à rejoindre
     * @return JsonResponse Réponse JSON indiquant le succès ou l'échec de l'opération
     * @throws Exception Si l'utilisateur a déjà rejoint l'événement ou si l'événement n'existe pas
     */
    #[Route('/api/joinEvent/{id}', name: 'app_join_event', methods: ['POST'])]
    public function joinEvent($id): JsonResponse
    {
        $user = $this->getUser();
        $event = $this->eventRepository->find($id);
        if (!$event) {
            return $this->json(['message' => 'L\'evevenement n\'existe pas.'], 404);
        }

        $eventDto = new EventDTO();
        $eventDto->joueur = $user;
        $result = $this->eventManager->joinEvent($eventDto, $event);

        if (!$result) {
            return $this->json(['message' => 'Evenement deja rejoint'], 404);
        }
        return $this->json(['message' => 'Evenement rejoint avec succès'], 200, []);

    }

    /**
     * Permet à un utilisateur de quitter un événement
     *
     * @param int $id ID de l'événement à quitter
     * @return JsonResponse Réponse JSON avec le résultat de l'opération
     * @throws Exception Si l'utilisateur n'est pas inscrit à l'événement
     */
    #[Route('/api/leaveEvent/{id}', name: 'app_leave_event', methods: ['POST'])]
    public function leaveEvent($id): JsonResponse
    {
        $user = $this->getUser();
        $event = $this->eventRepository->find($id);

        if (!$user) {
            return $this->json(['message' => 'Utilisateur non authentifié.'], 401);
        }

        if (!$event) {
            return $this->json(['message' => 'Événement introuvable.'], 404);
        }

        $eventDto = new EventDTO();
        $eventDto->joueur = $user;

        $result = $this->eventManager->leaveEvent($eventDto, $event);

        if (!$result) {
            return $this->json(['message' => 'Vous n\'êtes pas inscrit à cet événement.'], 400);
        }

        return $this->json(['message' => 'Vous avez quitté l\'événement avec succès.'], 200);
    }


    /**
     * Change l'état d'un événement si l'utilisateur est son créateur
     * Permet de démarer ou mettre fin à l'événement
     *
     * @param int $id ID de l'événement à modifier
     * @return JsonResponse Réponse JSON indiquant le succès ou l'échec de l'opération
     */
    #[Route('/api/changeState/{id}', name: 'app_change_state_event', methods: ['POST'])]
    public function changeState($id): JsonResponse
    {
        $event = $this->eventRepository->find($id);
        if (!$event) {
            return $this->json(['message' => 'Aucun événement trouvé'], 404);
        }

        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non autorisé'], 401);
        }

        if ($user === $event->getCreatedBy()) {
            $dto = new EventDTO();
            if ($event->getEtat() === 0) {
                $dto->etat = 1;
            } elseif ($event->getEtat() === 1) {
                $dto->etat = 2;
            } else {
                return $this->json(['message' => "L'événement a déjà atteint son état final"], 400);
            }

            $this->eventManager->changeState($dto, $event);
            return $this->json(['message' => "État de l'événement mis à jour avec succès"], 200);
        }

        return $this->json(['message' => "Vous n'êtes pas autorisé à modifier cet événement"], 403);
    }


}
