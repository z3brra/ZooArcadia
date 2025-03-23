<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\{Utils, StringHelper};
use App\DTO\{UserCreateDTO, UserUpdateDTO};
use App\Exception\ValidationException;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\{Request, JsonResponse, Response};
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;


#[Route('/api/admin', name: 'app_api_admin_')]
final class AdminUserController extends AbstractController
{

    public function __construct (
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private SerializerInterface $serializer
    ) {
    }

    #[Route('/create', name: 'create', methods: 'POST')]
    public function createUser(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
    ): JsonResponse {

        try {
            try {
                $userCreateDTO = $this->serializer->deserialize(
                    data: $request->getContent(),
                    type: UserCreateDTO::class,
                    format: 'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestException("Invalid JSON format");
            }

            $errors = $validator->validate($userCreateDTO);
            if (count($errors) > 0) {
                $validationErrors = [];
                foreach ($errors as $error) {
                    $validationErrors[] = $error->getMessage();
                }
                throw new ValidationException($validationErrors);
            }

            $user = new User();
            $user->setFirstName($userCreateDTO->firstName);
            $user->setLastName($userCreateDTO->lastName);
            $user->setRoles([$userCreateDTO->role]);

            $email = StringHelper::generateEmail($userCreateDTO->firstName, $userCreateDTO->lastName);
            $user->setEmail($email);

            $plainPassword = Utils::randomPassword();
            $hashedPassword = $passwordHasher->hashPassword($user, $plainPassword);

            $user->setPassword($hashedPassword);

            $user->setCreatedAt(new \DateTimeImmutable());
            $user->setMustChangePassword(true);

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'User successfully created',
                'email' => $user->getUserIdentifier(),
                'password' => $plainPassword,
                'roles' => $user->getRoles()
            ], JsonResponse::HTTP_CREATED);

        } catch (BadRequestException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_BAD_REQUEST
            );
        } catch (ValidationException $e) {
            return new JsonResponse(
                data: json_decode($e->getMessage(), true),
                status: JsonResponse::HTTP_UNPROCESSABLE_ENTITY
            );
        } catch (\Exception $e) {
            return new JsonResponse(
                data: ['error' => "An internal server error as occured"],
                status: JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/reset-password/{uuid}', name: 'reset_password', methods: ['POST'])]
    public function resetPassword(
        string $uuid,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {

        try {
            $user = $this->userRepository->findOneBy(['uuid' => $uuid]);
            if (!$user) {
                throw new UserNotFoundException('User not found or does not exist');
            }

            $plainPassword = Utils::randomPassword();
            $hashedPassword = $passwordHasher->hashPassword($user, $plainPassword);

            $user->setPassword($hashedPassword);
            $user->setMustChangePassword(true);
            $user->setUpdatedAt(new \DateTimeImmutable());

            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Password successfully reset',
                'email' => $user->getEmail(),
                'password' => $plainPassword,
                'message' => "The new password has been sent to the user"
            ], JsonResponse::HTTP_OK);

        } catch (UserNotFoundException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_NOT_FOUND
            );
        } catch (\Exception $e) {
            return new JsonResponse(
                data: ['error' => "An internal server error as occured"],
                status: JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/delete-user/{uuid}', name: 'delete_user', methods: 'DELETE')]
    public function deleteUser(
        string $uuid,
    ): JsonResponse {
        try {
            $user = $this->userRepository->findOneBy(['uuid' => $uuid]);
            if (!$user) {
                throw new UserNotFoundException('User not found or does not exist');
            }

            $this->entityManager->remove($user);
            $this->entityManager->flush();

            return new JsonResponse(
                data: ['message' => 'User successfully deleted'],
                status: JsonResponse::HTTP_OK
            );

        } catch (UserNotFoundException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_NOT_FOUND
            );
        } catch (\Exception $e) {
            return new JsonResponse(
                data: ['error' => "An internal server error as occured"],
                status: JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/update-user/{uuid}', name: 'update_user', methods: 'PUT')]
    public function updateUser(
        string $uuid,
        Request $request,
        ValidatorInterface $validator
    ): JsonResponse {

        try {
            $user = $this->userRepository->findOneBy(['uuid' => $uuid]);
            if (!$user) {
                throw new UserNotFoundException('User not found or does not exist');
            }

            try {
                $userUpdateDTO = $this->serializer->deserialize(
                    data: $request->getContent(),
                    type: UserUpdateDTO::class,
                    format: 'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestException("Invalid JSON format");
            }

            if ($userUpdateDTO->isEmpty()) {
                throw new BadRequestException("No data to update");
            }

            $errors = $validator->validate($userUpdateDTO);
            if (count($errors) > 0) {
                $validationErrors = [];
                foreach ($errors as $error) {
                    $validationErrors[] = $error->getMessage();
                }
                throw new ValidationException($validationErrors);
            }

            if ($userUpdateDTO->firstName !== null) {
                $user->setFirstName($userUpdateDTO->firstName);
            }

            if ($userUpdateDTO->lastName !== null) {
                $user->setLastName($userUpdateDTO->lastName);
            }

            if ($userUpdateDTO->role !== null) {
                $user->setRoles([$userUpdateDTO->role]);
            }

            $user->setUpdatedAt(new \DateTimeImmutable());

            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'User successfully updated',
                'id' => $user->getId(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'email' => $user->getUserIdentifier(),
                'roles' => $user->getRoles()
            ], JsonResponse::HTTP_OK);

        } catch (UserNotFoundException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_NOT_FOUND
            );
        } catch (BadRequestException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_BAD_REQUEST
            );
        } catch (ValidationException $e) {
            return new JsonResponse(
                data: json_decode($e->getMessage(), true),
                status: JsonResponse::HTTP_UNPROCESSABLE_ENTITY
            );
        } catch (\Exception $e) {
            return new JsonResponse(
                data: ['error' => "An internal server error as occured"],
                status: JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}

?>
