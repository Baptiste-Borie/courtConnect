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
        $newUser->setTrustability(0);

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

    public function updateUser(UserDTO $userDTO, User $user) {

        $user->setUsername($userDTO->username);
//        $user->setPassword($userDTO->password);
        $user->setNom($userDTO->nom);
        $user->setPrenom($userDTO->prenom);
        $user->setPseudo($userDTO->pseudo);
        $user->setImageUrl($userDTO->image_url);

        $this->em->persist($user);
        $this->em->flush();

        try {
            $this->em->persist($user);
            $this->em->flush();
            return $user;
        } catch (\Exception $e) {
            return null;
        }

    }
}
