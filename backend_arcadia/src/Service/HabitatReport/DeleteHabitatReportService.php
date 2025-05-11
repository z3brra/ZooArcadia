<?php

namespace App\Service\HabitatReport;

use App\Repository\HabitatReportRepository;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DeleteHabitatReportService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private HabitatReportRepository $habitatReportRepository
    ) {}

    public function deleteReport(string $uuid): void
    {
        $report = $this->habitatReportRepository->findOneByUuid($uuid);
        if (!$report) {
            throw new NotFoundHttpException("Habitat report not found or does not exist");
        }

        $this->entityManager->remove($report);
        $this->entityManager->flush();
    }
}

?>
