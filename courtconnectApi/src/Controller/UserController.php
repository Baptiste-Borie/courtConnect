<?php

namespace App\Controller;

use App\Dto\UserDTO;
use App\Entity\User;
use App\Manager\UserManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class UserController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function register(Request $request, UserManager $userManager, UserPasswordHasherInterface $passwordHasher): Response
    {
        $user = new User();
        $data = json_decode($request->getContent(), true);
        $dto = new UserDTO();
        $dto->username = $data['username'];
        $dto->password = $passwordHasher->hashPassword($user, $data['password']);
        $dto->nom = $data['nom'];
        $dto->prenom = $data['prenom'];
        $dto->image_url = $data['imageUrl'];
        $dto->trustability = $data['trustability'];

        $user = $userManager->addUser($dto);

        if (!$user) {
            return $this->json(['message' => 'Erreur lors de la création du user.'], 500);
        }

        return $this->json($user, 200, [], ['groups' => ['user']]);
    }
}
