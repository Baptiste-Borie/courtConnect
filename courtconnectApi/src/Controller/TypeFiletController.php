<?php

namespace App\Controller;

use App\Entity\TypeFilet;
use App\Repository\TypeFiletRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TypeFiletController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em, private TypeFiletRepository $typeFiletRepository)
    {

    }

    #[Route('/api/getAllTypeFilet', name: 'app_get_all_type_filet', methods: ['GET'])]
    public function getAllTypeFilet(Request $request): Response
    {
        $typeFilets = $this->typeFiletRepository->findAll();

        return $this->json($typeFilets, 200, [], ['groups' => ['type_filet']]);
    }

    #[Route('/api/addTypeFilet', name: 'app_add_type_filet', methods: ['POST'])]
    public function addTypeFilet(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $typeFilet = new TypeFilet();

        $typeFilet->setNom($data['nom']);
        $this->em->persist($typeFilet);
        $this->em->flush();

        if (!$typeFilet) {
            return $this->json(['message' => 'Erreur lors de la création du type de filet.'], 500);
        }

        return $this->json($typeFilet, 200, [], ['groups' => ['terrain']]);
    }

}
