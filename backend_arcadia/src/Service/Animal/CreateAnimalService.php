<?php

namespace App\Service\Animal;

use App\Entity\Animal;
use App\Repository\AnimalRepository;
use App\DTO\Animal\AnimalDTO;
use App\DTO\Animal\AnimalReadDTO;

use App\Repository\SpeciesRepository;
use App\Service\ValidationService;
use App\Repository\HabitatRepository;

use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CreateAnimalService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private SpeciesRepository $speciesRepository,
        private HabitatRepository $habitatRepository,

        private ValidationService $validationService
    ) {}

    public function createAnimal(AnimalDTO $animalCreateDTO): AnimalReadDTO
    {
        $this->validationService->validate($animalCreateDTO, ['create']);

        $species = $this->speciesRepository->findOneByUuid($animalCreateDTO->speciesUuid);
        if (!$species) {
            throw new NotFoundHttpException("Species not found with UUID : " . $animalCreateDTO->speciesUuid);
        }

        if ($animalCreateDTO->habitatUuid !== null) {
            $habitat = $this->habitatRepository->findOneByUuid($animalCreateDTO->habitatUuid);
            if (!$habitat) {
                throw new NotFoundHttpException("Habitat not found with UUID : " . $animalCreateDTO->habitatUuid);
            }
        } else {
            $habitat = $animalCreateDTO->habitatUuid;
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
        $animal->setHabitat($habitat);

        $animal->setCreatedAt(new DateTimeImmutable());

        $this->entityManager->persist($animal);
        $this->entityManager->flush();

        return AnimalReadDTO::fromEntity($animal);
    }
}


?>
