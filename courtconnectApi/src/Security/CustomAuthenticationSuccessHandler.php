<?php

namespace App\Security;

use App\Entity\RefreshToken;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private JWTTokenManagerInterface $jwtManager;
    private EntityManagerInterface $em;

    public function __construct(JWTTokenManagerInterface $jwtManager, EntityManagerInterface $em)
    {
        $this->jwtManager = $jwtManager;
        $this->em = $em;
    }

    /**
     * Gère la réponse en cas de succès de l'authentification.
     *
     * Cette méthode est appelée automatiquement après une authentification réussie.
     * Elle génère un JWT pour l'utilisateur authentifié ainsi qu'un refresh token
     * valable pendant 30 jours, et les retourne dans la réponse JSON.
     *
     * @param Request $request La requête HTTP d'authentification.
     * @param TokenInterface $token Le token d'authentification contenant l'utilisateur.
     *
     * @return JsonResponse Réponse JSON contenant le JWT et le refresh token.
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JsonResponse
    {
        $user = $token->getUser();
        $jwt = $this->jwtManager->create($user);

        $refreshToken = new RefreshToken();
        $refreshToken->setUser($user);
        $refreshToken->setToken(bin2hex(random_bytes(64)));
        $refreshToken->setExpiresAt(new \DateTimeImmutable('+30 days'));

        $this->em->persist($refreshToken);
        $this->em->flush();

        return new JsonResponse([
            'token' => $jwt,
            'refresh_token' => $refreshToken->getToken(),
        ]);
    }
}
