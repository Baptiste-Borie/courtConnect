<?php

namespace App\Controller;

use App\Entity\TypePanier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TypePanierController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em)
    {

    }
    #[Route('/api/addTypePanier', name: 'app_add_type_panier', methods: ['POST'])]
    public function addTypePanier(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $typePanier = new TypePanier();

        $typePanier->setNom($data['nom']);
        $this->em->persist($typePanier);
        $this->em->flush();

        if (!$typePanier) {
            return $this->json(['message' => 'Erreur lors de la création du type de panier.'], 500);
        }

        return $this->json($typePanier, 200, [], ['groups' => ['terrain']]);
    }
}
