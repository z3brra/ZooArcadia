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

    public function showHabitatAnimals(string $uuid, ?int $limit): array
    {
        $habitat = $this->habitatRepository->findOneByUuid($uuid);
        if (!$habitat) {
            throw new NotFoundHttpException("Habitat not found or does not exist");
        }

        if ($limit === null) {
            $animals = $habitat->getAnimals();
        } else {
            $animals = $habitat->getAnimals()->slice(0, $limit);
        }
        $animalsDTOs = [];

        foreach ($animals as $animal) {
            $animalsDTOs[] = AnimalReadDTO::fromEntity($animal);
        }

        return $animalsDTOs;
    }

    public function showAllHabitat(): array {
        $habitats = $this->habitatRepository->findAll();

        $habitatsDTOs = [];
        foreach ($habitats as $habitat) {
            $habitatsDTOs[] = HabitatReadDTO::fromEntity($habitat);
        }

        return [
            "data" => $habitatsDTOs,
            "total" => count($habitatsDTOs)
        ];
    }
}


?>