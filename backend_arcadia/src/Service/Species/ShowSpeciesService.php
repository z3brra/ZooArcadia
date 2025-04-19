<?php

namespace App\Service\Species;

use App\Repository\SpeciesRepository;
use App\DTO\Species\SpeciesReadDTO;
use App\DTO\Animal\AnimalReadDTO;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ShowSpeciesService
{
    public function __construct(
        private SpeciesRepository $speciesRepository
    ) {}

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
}


?>