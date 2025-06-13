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

}
