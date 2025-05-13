<?php

namespace App\Service\AnimalReport;

use App\Repository\AnimalReportRepository;

use App\DTO\AnimalReport\AnimalReportReadDTO;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ShowAnimalReportService
{
    public function __construct(
        private AnimalReportRepository $animalReportRepository
    ) {}

    public function showReport(string $uuid): AnimalReportReadDTO
    {
        $report = $this->animalReportRepository->findOneByUuid($uuid);
        if (!$report) {
            throw new NotFoundHttpException("Animal report not found or does not exist");
        }

        return AnimalReportReadDTO::fromEntity($report);
    }
}

?>