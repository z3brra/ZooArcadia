<?php

namespace App\Service;

use App\DTO\AnimalReadDTO;
use DateTimeImmutable;

use App\Entity\Habitat;
use App\Repository\HabitatRepository;
use App\DTO\HabitatDTO;
use App\DTO\HabitatReadDTO;

use Doctrine\ORM\EntityManagerInterface;

use App\Exception\ValidationException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class HabitatService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private HabitatRepository $habitatRepository,
        private ValidatorInterface $validator
    ) {}

    public function createHabitat(HabitatDTO $habitatCreateDTO): HabitatReadDTO
    {
        $errors = $this->validator->validate($habitatCreateDTO, null, ['create']);
        if (count($errors) > 0) {
            $validationErrors = [];
            foreach ($errors as $error) {
                $validationErrors[] = $error->getMessage();
            }
            throw new ValidationException($validationErrors);
        }

        $habitat = new Habitat();
        $habitat->setName($habitatCreateDTO->name);
        $habitat->setDescription($habitatCreateDTO->description);

        $habitat->setCreatedAt(new DateTimeImmutable());

        $this->entityManager->persist($habitat);
        $this->entityManager->flush();

        return HabitatReadDTO::fromEntity($habitat);
    }

    public function showHabitat(string $uuid): HabitatReadDTO
    {
        $habitat = $this->habitatRepository->findOneByUuid($uuid);
        if (!$habitat) {
            throw new NotFoundHttpException("Habitat not found or does not exist");
        }

        return HabitatReadDTO::fromEntity($habitat);
    }

    public function showHabitatAnimals(string $uuid): array
    {
        $habitat = $this->habitatRepository->findOneByUuid($uuid);
        if (!$habitat) {
            throw new NotFoundHttpException("Habitat not found or does not exist");
        }

        $animals = $habitat->getAnimals();
        $animalsDTOs = [];

        foreach ($animals as $animal) {
            $animalsDTOs[] = AnimalReadDTO::fromEntity($animal);
        }

        return $animalsDTOs;
    }

    public function updateHabitat(string $uuid, HabitatDTO $habitatUpdateDTO): HabitatReadDTO
    {
        $habitat = $this->habitatRepository->findOneByUuid($uuid);
        if (!$habitat) {
            throw new NotFoundHttpException("Habitat not found or does not exist");
        }

        if ($habitatUpdateDTO->isEmpty()) {
            throw new BadRequestException("No data to update");
        }

        $errors = $this->validator->validate($habitatUpdateDTO, null, ['update']);
        if (count($errors) > 0) {
            $validationErrors = [];
            foreach ($errors as $error) {
                $validationErrors[] = $error->getMessage();
            }
            throw new ValidationException($validationErrors);
        }

        $name = $habitatUpdateDTO->name;
        $description = $habitatUpdateDTO->description;

        if ($name !== null) {
            $habitat->setName($name);
        }

        if ($description !== null) {
            $habitat->setDescription($description);
        }

        $habitat->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->flush();

        return HabitatReadDTO::fromEntity($habitat);
    }

    public function deleteHabitat(string $uuid): void
    {
        $habitat = $this->habitatRepository->findOneByUuid($uuid);
        if (!$habitat) {
            throw new NotFoundHttpException("Habitat not found or does not exist");
        }

        $this->entityManager->remove($habitat);
        $this->entityManager->flush();
    }

    public function listHabitatPaginated(int $page = 1, int $limit = 10): array
    {
        $result = $this->habitatRepository->findPaginated($page, $limit);

        $habitatDTOs = [];
        foreach ($result['data'] as $habitat) {
            $habitatDTOs[] = HabitatReadDTO::fromEntity($habitat);
        }

        return [
            'data' => $habitatDTOs,
            'total' => $result['total'],
            'totalPages' => $result['totalPages'],
            'currentPage' => $result['currentPage'],
            'perPage' => $result['perPage']
        ];
    }

}

?>
