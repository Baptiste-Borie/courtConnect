<?php

namespace App\Controller;

use App\Dto\EventDTO;
use App\Entity\Event;
use App\Manager\EventManager;
use App\Repository\EventRepository;
use App\Repository\TerrainRepository;
use App\Repository\TypeEventRepository;
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

    )
    {

    }
    #[Route('/api/getAllEvents', name: 'app_terrain')]
    public function getAll(): Response
    {
        $terrain = $this->eventRepository->findAll();

        return $this->json($terrain, 200, [], ['groups' => ['all_events']]);
    }

    #[Route('/api/getEvent/{id}', name: 'app_get_event_by_id', methods: ['GET'])]
    public function getEventById(int $id): JsonResponse
    {
        $event = $this->eventRepository->find($id);

        if (!$event) {
            return $this->json(['message' => 'Evenement non trouvé'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($event, Response::HTTP_OK, [], ['groups' => ['all_events']]);
    }


    #[Route('/api/addEvent', name: 'app_add_event', methods: ['POST'])]
    public function addEvent(Request $request, EventManager $eventManager): JsonResponse
    {
        return $this->handleEvent($request, $eventManager);
    }

    #[Route('/api/updateEvent/{id}', name: 'app_update_event', methods: ['POST'])]
    public function updateEvent(Request $request, EventManager $eventManager, $id): JsonResponse
    {
        $event = $this->eventRepository->find($id);
        if (!$event) {
            return $this->json(['message' => 'Événement non trouvé.'], 404);
        }

        return $this->handleEvent($request, $eventManager, $event);
    }

    /**
     * Gère la création ou la mise à jour d'un événement.
     *
     * @param Request $request         La requête HTTP contenant les données JSON de l'événement.
     * @param EventManager $eventManager Le gestionnaire d'événements utilisé pour persister les données.
     * @param Event|null $event        L'événement à mettre à jour, ou null pour en créer un nouveau.
     *
     * @return JsonResponse           Réponse JSON contenant l'événement créé/mis à jour ou un message d'erreur.
     */
    private function handleEvent(Request $request, EventManager $eventManager, ?Event $event = null): JsonResponse
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
        $dto->etat = $data['etat'];
        $dto->type_event = $this->typeEventRepository->findOneBy(['id' => $data['typeEvent']]);

        $result = $event
            ? $eventManager->updateEvent($dto, $event)
            : $eventManager->addEvent($dto);

        if (!$result) {
            return $this->json([
                'message' => $event
                    ? 'Erreur lors de la mise à jour de l\'événement.'
                    : 'Erreur lors de la création de l\'événement.'
            ], 500);
        }

        return $this->json($result, 200, [], ['groups' => ['all_events']]);
    }

    #[Route('/api/joinEvent/{id}', name: 'app_join_event', methods: ['POST'])]
    public function joinEvent(Request $request, $id, EventManager $eventManager): JsonResponse
    {
        $user = $this->getUser();
        $event = $this->eventRepository->find($id);
        if (!$event) {
            return $this->json(['message' => 'L\'evevenement n\'existe pas.'], 404);
        }

        $eventDto = new EventDTO();
        $eventDto->joueur = $user;
        $result = $eventManager->joinEvent($eventDto, $event);

        if (!$result) {
            return $this->json(['message' => 'Evenement deja rejoint'], 404);
        }
        return $this->json(['message' => 'Evenement rejoint avec succès'], 200, []);

    }

    #[Route('/api/leaveEvent/{id}', name: 'app_leave_event', methods: ['POST'])]
    public function leaveEvent(Request $request, $id, EventManager $eventManager): JsonResponse
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

        $result = $eventManager->leaveEvent($eventDto, $event);

        if (!$result) {
            return $this->json(['message' => 'Vous n\'êtes pas inscrit à cet événement.'], 400);
        }

        return $this->json(['message' => 'Vous avez quitté l\'événement avec succès.'], 200);
    }

}
