<?php

namespace App\Service\Habitat;

use App\Repository\HabitatRepository;
use App\DTO\Habitat\HabitatReadDTO;
use App\DTO\Animal\AnimalReadDTO;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ShowHabitatService
{
    public function __construct(
        private HabitatRepository $habitatRepository
    ) {}

    public function showHabitat(string $uuid): HabitatReadDTO
    {
        $habitat = $this->habitatRepository->findOneByUuid($uuid);
        if (!$habitat) {
            throw new NotFoundHttpException("Habitat not found or does not exist");
        }

        return HabitatReadDTO::fromEntity($habitat, true);
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
}


?>