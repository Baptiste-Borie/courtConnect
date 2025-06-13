<?php

namespace App\Manager;

use App\Dto\UserDTO;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserManager
{

    public function __construct(private EntityManagerInterface $em)
    {

    }
    public function addUser(UserDTO $userDTO) {
        $newUser = new User();

        $newUser->setUsername($userDTO->username);
        $newUser->setRoles(["ROLE_USER"]);
        $newUser->setPassword($userDTO->password);
        $newUser->setNom($userDTO->nom);
        $newUser->setPrenom($userDTO->prenom);
        $newUser->setPseudo($userDTO->pseudo);
        $newUser->setImageUrl($userDTO->image_url);
        $newUser->setTrustability($userDTO->trustability);

        $this->em->persist($newUser);
        $this->em->flush();

        try {
            $this->em->persist($newUser);
            $this->em->flush();
            return $newUser;
        } catch (\Exception $e) {
            return null;
        }

    }
}
