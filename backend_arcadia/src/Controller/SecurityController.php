<?php


namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\{Request, JsonResponse, Response};
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;

#[Route('/api/auth', name: 'app_api_auth_')]
final class SecurityController extends AbstractController
{

    public function __construct(
        private UserRepository $userRepository,
    ) {}

    #[Route('/login', name: 'login', methods: 'POST')]
    public function login(
        Request $request,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {

        try {
            $data = json_decode($request->getContent(), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new NotEncodableValueException("Invalid JSON format.");
            }

            if (empty($data['username']) || empty($data['password'])) {
                throw new BadRequestException('Email and password are required');
            }

            $user = $this->userRepository->findOneBy(['email' => $data['username']]);

            if (!$user || !$passwordHasher->isPasswordValid($user, $data['password'])) {
                throw new BadCredentialsException("Invalid credentials.");
            }

            return new JsonResponse([
                'message' => 'Login successful',
                'email' => $user->getEmail(),
                'apiToken' => $user->getApiToken(),
                'roles' => $user->getRoles(),
            ], JsonResponse::HTTP_OK);

        } catch (\Exception $e) {
            return new JsonResponse(
                data: ['error' => "An internal server error as occured"],
                status: JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
