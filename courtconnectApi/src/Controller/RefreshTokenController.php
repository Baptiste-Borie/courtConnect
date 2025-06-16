<?php

namespace App\Controller;

use App\Repository\RefreshTokenRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class RefreshTokenController extends AbstractController
{

    /**
     * Endpoint pour rafraîchir un JWT à l’aide d’un refresh token valide.
     *
     * Cette méthode reçoit une requête POST contenant un refresh token en JSON,
     * vérifie son existence et sa validité (non expiré),
     * puis génère un nouveau JWT pour l’utilisateur associé.
     *
     * @param Request $request La requête HTTP contenant le refresh token au format JSON.
     * @param RefreshTokenRepository $refreshTokenRepository Le dépôt pour récupérer le refresh token en base.
     * @param JWTTokenManagerInterface $jwtManager Le gestionnaire JWT pour créer un nouveau token.
     *
     * @return JsonResponse Réponse JSON contenant un nouveau token JWT ou un message d’erreur en cas d’échec.
     */
    #[Route('/api/token/refresh', name: 'refresh_token', methods: ['POST'])]
    public function refreshToken(
        Request $request,
        RefreshTokenRepository $refreshTokenRepository,
        JWTTokenManagerInterface $jwtManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['refresh_token'])) {
            return new JsonResponse(['message' => 'Refresh token missing'], 400);
        }

        $refreshToken = $refreshTokenRepository->findOneBy(['token' => $data['refresh_token']]);

        if (!$refreshToken || $refreshToken->isExpired()) {
            return new JsonResponse(['message' => 'Invalid or expired refresh token'], 401);
        }

        $user = $refreshToken->getUser();
        $newJwt = $jwtManager->create($user);

        return new JsonResponse([
            'token' => $newJwt,
        ], 200);
    }
}
