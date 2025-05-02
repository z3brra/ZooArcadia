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

        return SpeciesReadDTO::fromEntity($species, true);
    }

    public function showSpeciesAnimals(string $uuid, ?int $limit): array
    {
        $species = $this->speciesRepository->findOneByUuid($uuid);

        if (!$species) {
            throw new NotFoundHttpException("Species not found or does not exist");
        }

        if ($limit === null) {
            $animals = $species->getAnimals();
        } else {
            $animals = $species->getAnimals()->slice(0, $limit);
        }
        $animalsDTOs = [];

        foreach ($animals as $animal) {
            $animalsDTOs[] = AnimalReadDTO::fromEntity($animal);
        }

        return $animalsDTOs;
    }

    public function showAllSpecies(): array {
        $species = $this->speciesRepository->findAll();

        $speciesDTOs = [];
        foreach ($species as $specie) {
            $speciesDTOs[] = SpeciesReadDTO::fromEntity($specie);
        }

        // return $speciesDTOs;
        return [
            "data" => $speciesDTOs,
            "total" => count($speciesDTOs)
        ];
    }
}


?>