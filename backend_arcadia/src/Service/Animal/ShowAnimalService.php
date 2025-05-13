<?php

namespace App\Service\Animal;

use App\Repository\AnimalRepository;
use App\DTO\Animal\AnimalReadDTO;
use App\DTO\AnimalReport\AnimalReportReadDTO;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ShowAnimalService
{
    public function __construct(
        private AnimalRepository $animalRepository,
    ) {}

    public function showAnimal(string $uuid): AnimalReadDTO
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);

        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }

        return AnimalReadDTO::fromEntity($animal);
    }

    public function showAnimalReports(string $uuid, ?int $limit): array
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);
        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }

        if ($limit === null) {
            $reports = $animal->getAnimalReports();
        } else {
            $reports = $animal->getAnimalReports()->slice(0, $limit);
        }

        $reportsDTOs = [];
        foreach ($reports as $report) {
            $reportsDTOs[] = AnimalReportReadDTO::fromEntity($report);
        }

        return $reportsDTOs;
    }

    public function showAllAnimal(): array {
        $animals = $this->animalRepository->findAll();

        $animalsDTOs = [];
        foreach ($animals as $animal) {
            $animalsDTOs[] = AnimalReadDTO::fromEntity($animal);
        }

        return [
            "data" => $animalsDTOs,
            "total" => count($animalsDTOs)
        ];
    }
}

?>