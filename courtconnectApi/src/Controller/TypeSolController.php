<?php

namespace App\Controller;

use App\Entity\TypeSol;
use App\Repository\TypeSolRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TypeSolController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em, private TypeSolRepository $typeSolRepository)
    {

    }

    #[Route('/api/getAllTypeSol', name: 'app_get_all_type_sol', methods: ['GET'])]
    public function getAllTypeSol(Request $request): Response
    {
        $typeSol = $this->typeSolRepository->findAll();

        return $this->json($typeSol, 200, [], ['groups' => ['type_sol']]);
    }

    #[Route('/api/addTypeSol', name: 'app_add_type_sol', methods: ['POST'])]
    public function addTypeSol(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $typeSol = new TypeSol();

        $typeSol->setNom($data['nom']);
        $this->em->persist($typeSol);
        $this->em->flush();

        if (!$typeSol) {
            return $this->json(['message' => 'Erreur lors de la création du type de sol.'], 500);
        }

        return $this->json($typeSol, 200, [], ['groups' => ['terrain']]);
    }
}
