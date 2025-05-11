<?php

namespace App\Service\HabitatReport;

use App\Repository\HabitatReportRepository;

use App\DTO\HabitatReport\HabitatReportReadDTO;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ShowHabitatReportService
{
    public function __construct(
        private HabitatReportRepository $habitatReportRepository
    ) {}

    public function showReport(string $uuid): HabitatReportReadDTO
    {
        $report = $this->habitatReportRepository->findOneByUuid($uuid);
        if (!$report) {
            throw new NotFoundHttpException("Habitat report not found or does not exist");
        }

        return HabitatReportReadDTO::fromEntity($report);
    }
}

?>