<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\{Request, JsonResponse, Cookie, Response};
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/auth', name: 'app_api_auth_')]
final class SecurityController extends AbstractController
{

    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/login', name: 'login', methods: 'POST')]
    public function login(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
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

            $token = $user->getApiToken();

            $cookie = Cookie::create('access_token')
                ->withValue($token)
                ->withHttpOnly(true)
                ->withSecure($request->isSecure())
                ->withSameSite('strict')
                ->withExpires(new \DateTimeImmutable('+7 days'));

            $response = new JsonResponse(
                data: [
                    'message'            => 'Login successful',
                    'email'              => $user->getUserIdentifier(),
                    'mustChangePassword' => $user->isMustChangePassword(),
                    'roles'              => $user->getRoles()
                ], 
                status: JsonResponse::HTTP_OK,
            );

            $response->headers->setCookie($cookie);

            return $response;

        } catch (BadRequestException | NotEncodableValueException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_BAD_REQUEST
            );
        } catch (BadCredentialsException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_UNAUTHORIZED
            );
        } catch (\Exception $e) {
            return new JsonResponse(
                data: ['error' => "An internal server error as occured"],
                status: JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/me', name: 'me', methods: 'GET')]
    public function me(): JsonResponse
    {
        try {
            $user = $this->getUser();

            if (!$user) {
                throw new AccessDeniedHttpException("User not authenticated.");
            }

            return new JsonResponse([
                'uuid'               => $user->getUuid(),
                'firstName'          => $user->getFirstName(),
                'lastName'           => $user->getLastName(),
                'email'              => $user->getUserIdentifier(),
                'roles'              => $user->getRoles(),
                'mustChangePassword' => $user->isMustChangePassword(),
                'createdAt'          => $user->getCreatedAt()->format('Y-m-d H:i:s'),
                'updatedAt'          => $user->getUpdatedAt() ? $user->getUpdatedAt()->format('Y-m-d H:i:s') : null
            ], JsonResponse::HTTP_OK);

        } catch (AccessDeniedHttpException $e) {
            return new JsonResponse(
                ['error' => $e->getMessage()],
                JsonResponse::HTTP_FORBIDDEN
            );
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => "An internal server error occurred"],
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/change-password', name: 'change_password', methods: 'POST')]
    public function changePassword(
        Request $request,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {

        try {
            $user = $this->getUser();

            if (!$user) {
                throw new AccessDeniedHttpException("User not authenticated.");
            }

            $data = json_decode($request->getContent(), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new NotEncodableValueException("Invalid JSON format.");
            }

            if (empty($data['oldPassword']) || empty($data['newPassword'])) {
                throw new BadRequestException("Old and new password are required.");
            }

            if (!$passwordHasher->isPasswordValid($user, $data['oldPassword'])) {
                throw new BadCredentialsException("Incorrect old password.");
            }

            if (strlen($data['newPassword']) < 8) {
                throw new BadRequestException("New password must be at least 8 characters long.");
            }

            $hashedPassword = $passwordHasher->hashPassword($user, $data['newPassword']);
            $user->setPassword($hashedPassword);
            $user->setMustChangePassword(false);
            $user->setUpdatedAt(new \DateTimeImmutable());

            $this->entityManager->flush();

            return new JsonResponse([
                'message'  => 'Password changed successfully',
                'apiToken' => $user->getApiToken()
            ],JsonResponse::HTTP_OK);


        } catch (AccessDeniedHttpException $e) {
            return new JsonResponse(
                ['error' => $e->getMessage()],
                JsonResponse::HTTP_FORBIDDEN
            );
        } catch (BadRequestException | NotEncodableValueException $e) {
            return new JsonResponse(
                ['error' => $e->getMessage()],
                JsonResponse::HTTP_BAD_REQUEST
            );
        } catch (BadCredentialsException $e) {
            return new JsonResponse(
                ['error' => $e->getMessage()],
                JsonResponse::HTTP_UNAUTHORIZED
            );
        }
        catch (\Exception $e) {
            return new JsonResponse(
                data: ['error' => "An internal server error as occured"],
                status: JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }

    }
}
