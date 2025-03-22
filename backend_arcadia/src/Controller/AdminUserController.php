<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\{Utils, StringHelper};
use App\DTO\UserDTO;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\{Request, JsonResponse, Response};
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;


#[Route('/api/admin', name: 'app_api_admin_')]
final class AdminUserController extends AbstractController
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $entityManager,
        private UserRepository $repository,
        private SerializerInterface $serializer,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator
    ) {
    }

    #[Route('/create', name: 'create', methods: 'POST')]
    public function createUser(
        Request $request,
    ): JsonResponse {
        $admin = $this->getUser();
        if (!$admin || !in_array('ROLE_ADMIN', $admin->getRoles())) {
            throw new AccessDeniedException('Accès refusé.');
        }

        try {
            $userDTO = $this->serializer->deserialize($request->getContent(), UserDTO::class, 'json');
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Format JSON invalide'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setFirstName($userDTO->firstName);
        $user->setLastName($userDTO->lastName);
        $user->setRoles([$userDTO->role]);

        $email = StringHelper::generateEmail($userDTO->firstName, $userDTO->lastName);
        $user->setEmail($email);

        $plainPassword = Utils::randomPassword();

        $user->setPassword($this->passwordHasher->hashPassword($user, $plainPassword));

        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setMustChangePassword(true);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Utilisateur créé avec succès',
            'email' => $user->getUserIdentifier(),
            'password' => $plainPassword,
            'roles' => $user->getRoles()
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/reset-password/{id}', name: 'reset_password', methods: 'POST')]
    public function resetPassword(
        int $id,
    ): JsonResponse {
        $admin = $this->getUser();
        if (!$admin || !in_array('ROLE_ADMIN', $admin->getRoles())) {
            throw new AccessDeniedException('Accès refusé');
        }

        $user = $this->repository->findOneBy(['id' => $id]);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        $plainPassword = Utils::randomPassword();
        $user->setPassword($this->passwordHasher->hashPassword($user, $plainPassword));
        $user->setMustChangePassword(true);
        $user->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Mot de passe réinitialisé avec succès',
            'email' => $user->getUserIdentifier(),
            'password' => $plainPassword,
            'roles' => $user->getRoles()
        ], JsonResponse::HTTP_OK);
    }
}

?>
