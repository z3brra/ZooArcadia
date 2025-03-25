<?php

namespace App\Service;


use App\Entity\Animal;
use App\Repository\AnimalRepository;
use App\DTO\AnimalDTO;
use App\DTO\AnimalReadDTO;

use App\Service\SpeciesService;
use App\Repository\SpeciesRepository;

use App\Exception\ValidationException;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AnimalService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AnimalRepository $animalRepository,

        private SpeciesRepository $speciesRepository,

        private ValidatorInterface $validator
    ) {}

    public function createAnimal(AnimalDTO $animalCreateDTO): AnimalReadDTO
    {
        $errors = $this->validator->validate($animalCreateDTO, null, ['create']);
        if (count($errors) > 0) {
            $validationErrors = [];
            foreach ($errors as $error) {
                $validationErrors[] = $error->getMessage();
            }
            throw new ValidationException($validationErrors);
        }

        $species = $this->speciesRepository->findOneByUuid($animalCreateDTO->speciesUuid);
        if (!$species) {
            throw new NotFoundHttpException("Species not foud with UUID : " . $animalCreateDTO->speciesUuid);
        }

        $animal = new Animal();
        $animal->setName($animalCreateDTO->name);
        $animal->setIsMale($animalCreateDTO->isMale);
        $animal->setSize($animalCreateDTO->size);
        $animal->setWeight($animalCreateDTO->weight);
        $animal->setIsFertile($animalCreateDTO->isFertile);
        $animal->setBirthDate($animalCreateDTO->birthDate);
        $animal->setArrivalDate($animalCreateDTO->arrivalDate);
        $animal->setSpecies($species);

        $animal->setCreatedAt(new DateTimeImmutable());

        $this->entityManager->persist($animal);
        $this->entityManager->flush();

        return AnimalReadDTO::fromEntity($animal);
    }

    public function showAnimal(string $uuid): AnimalReadDTO
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);

        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }

        return AnimalReadDTO::fromEntity($animal);
    }


}

?>