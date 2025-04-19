<?php

namespace App\Service\Animal;

use App\Repository\AnimalRepository;
use App\DTO\Animal\AnimalDTO;
use App\DTO\Animal\AnimalReadDTO;

use App\Repository\SpeciesRepository;
use App\Service\ValidationService;
use App\Repository\HabitatRepository;

use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\{NotFoundHttpException, BadRequestHttpException};

class UpdateAnimalService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AnimalRepository $animalRepository,

        private SpeciesRepository $speciesRepository,
        private HabitatRepository $habitatRepository,

        private ValidationService $validationService
    ) {}

    public function updateAnimal(string $uuid, AnimalDTO $animalUpdateDTO): AnimalReadDTO
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);
        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }

        if ($animalUpdateDTO->isEmpty()) {
            throw new BadRequestHttpException("No data to update");
        }

        $this->validationService->validate($animalUpdateDTO, ['update']);

        $name = $animalUpdateDTO->name;
        $isMale = $animalUpdateDTO->isMale;
        $size = $animalUpdateDTO->size;
        $weight = $animalUpdateDTO->weight;
        $isFertile = $animalUpdateDTO->isFertile;
        $birthDate = $animalUpdateDTO->birthDate;
        $arrivalDate = $animalUpdateDTO->arrivalDate;
        $speciesUuid = $animalUpdateDTO->speciesUuid;
        $habitatUuid = $animalUpdateDTO->habitatUuid;

        if ($speciesUuid !== null) {
            $species = $this->speciesRepository->findOneByUuid($speciesUuid);
            if (!$species) {
                throw new NotFoundHttpException("Species not found with UUID : " . $speciesUuid);
            }
            $animal->setSpecies($species);
        }

        if ($habitatUuid !== null) {
            $habitat = $this->habitatRepository->findOneByUuid($habitatUuid);
            if (!$habitat) {
                throw new NotFoundHttpException("Species not found with UUID : " . $habitatUuid);
            }
            $animal->setHabitat($habitat);
        }

        if ($name !== null) {
            $animal->setName($name);
        }
        if ($isMale !== null) {
            $animal->setIsMale($isMale);
        }
        if ($size !== null) {
            $animal->setSize($size);
        }
        if ($weight !== null) {
            $animal->setWeight($weight);
        }
        if ($isFertile !== null) {
            $animal->setIsFertile($isFertile);
        }
        if ($birthDate !== null) {
            $animal->setBirthDate($birthDate);
        }
        if ($arrivalDate !== null) {
            $animal->setArrivalDate($arrivalDate);
        }
        
        $animal->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->flush();

        return AnimalReadDTO::fromEntity($animal);
    }
}

?>