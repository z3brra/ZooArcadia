<?php

namespace App\Service;


use App\Entity\Species;
use App\Repository\SpeciesRepository;
use App\DTO\SpeciesDTO;
use App\DTO\SpeciesReadDTO;
use App\DTO\AnimalReadDTO;
use App\Exception\ValidationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SpeciesService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SpeciesRepository $speciesRepository,
        private ValidatorInterface $validator
    ) {}

    public function createSpecies(SpeciesDTO $speciesCreateDTO): SpeciesReadDTO
    {
        $errors = $this->validator->validate($speciesCreateDTO, null, ['create']);
        if (count($errors) > 0) {
            $validationErrors = [];
            foreach ($errors as $error) {
                $validationErrors[] = $error->getMessage();
            }
            throw new ValidationException($validationErrors);
        }

        $species = new Species();
        $species->setCommonName($speciesCreateDTO->commonName);
        $species->setScientificName($speciesCreateDTO->scientificName);
        $species->setLifespan($speciesCreateDTO->lifespan);
        $species->setDiet($speciesCreateDTO->diet);
        $species->setDescription($speciesCreateDTO->description);

        $species->setCreatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($species);
        $this->entityManager->flush();

        return SpeciesReadDTO::fromEntity($species);
    }

    public function showSpecies(string $uuid): SpeciesReadDTO
    {
        $species = $this->speciesRepository->findOneByUuid($uuid);

        if (!$species) {
            throw new NotFoundHttpException("Species not found or does not exist");
        }

        return SpeciesReadDTO::fromEntity($species);
    }

    public function showSpeciesAnimals(string $uuid): array
    {
        $species = $this->speciesRepository->findOneByUuid($uuid);

        if (!$species) {
            throw new NotFoundHttpException("Species not found or does not exist");
        }

        $animals = $species->getAnimals();
        $animalsDTOs = [];

        foreach ($animals as $animal) {
            $animalsDTOs[] = AnimalReadDTO::fromEntity($animal);
        }

        return $animalsDTOs;
    }

    public function updateSpecies(string $uuid, SpeciesDTO $speciesUpdateDTO): SpeciesReadDTO
    {
        $species = $this->speciesRepository->findOneByUuid($uuid);

        if (!$species) {
            throw new NotFoundHttpException("Species not found or does not exist");
        }

        if ($speciesUpdateDTO->isEmpty()) {
            throw new BadRequestException("No data to update");
        }

        $errors = $this->validator->validate($speciesUpdateDTO);
        if (count($errors) > 0) {
            $validationErrors = [];
            foreach ($errors as $error) {
                $validationErrors[] = $error->getMessage();
            }
            throw new ValidationException($validationErrors);
        }

        $commonName = $speciesUpdateDTO->commonName;
        $scientificName = $speciesUpdateDTO->scientificName;
        $lifespan = $speciesUpdateDTO->lifespan;
        $diet = $speciesUpdateDTO->diet;
        $description = $speciesUpdateDTO->description;

        if ($commonName !== null) {
            $species->setCommonName($commonName);
        }
        if ($scientificName !== null) {
            $species->setScientificName($scientificName);
        }
        if ($lifespan !== null) {
            $species->setLifespan($lifespan);
        }
        if ($diet !== null) {
            $species->setDiet($diet);
        }
        if ($description !== null) {
            $species->setDescription($description);
        }

        $species->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return SpeciesReadDTO::fromEntity($species);
    }

    public function deleteSpecies(string $uuid): void
    {
        $species = $this->speciesRepository->findOneByUuid($uuid);

        if (!$species) {
            throw new NotFoundHttpException("Species not found or does not exist");
        }

        $this->entityManager->remove($species);
        $this->entityManager->flush();
    }

    public function listSpeciesPaginated(int $page, int $limit): array
    {
        $result = $this->speciesRepository->findPaginated($page, $limit);

        $speciesDTOs = [];
        foreach ($result['data'] as $species) {
            $speciesDTOs[] = SpeciesReadDTO::fromEntity($species);
        }

        return [
            'data' => $speciesDTOs,
            'total' => $result['total'],
            'totalPages' => $result['totalPages'],
            'currentPage' => $result['currentPage'],
            'perPage' => $result['perPage'],
        ];
    }
}

?>