<?php

namespace App\Controller;

use App\Entity\TypeEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TypeEventController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em)
    {

    }
    #[Route('/api/addTypeEvent', name: 'app_add_type_event', methods: ['POST'])]
    public function addTypeEvent(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $typeEvent = new TypeEvent();

        $typeEvent->setNom($data['nom']);
        $this->em->persist($typeEvent);
        $this->em->flush();

        if (!$typeEvent) {
            return $this->json(['message' => 'Erreur lors de la création du type d\'event.'], 500);
        }

        return $this->json($typeEvent, 200, [], ['groups' => ['all_events']]);
    }
}
