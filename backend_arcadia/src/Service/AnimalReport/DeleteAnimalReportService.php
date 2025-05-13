<?php

namespace App\Service\AnimalReport;

use App\Repository\AnimalReportRepository;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DeleteAnimalReportService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AnimalReportRepository $animalReportRepository
    ) {}

    public function deleteReport(string $uuid): void
    {
        $report = $this->animalReportRepository->findOneByUuid($uuid);
        if (!$report) {
            throw new NotFoundHttpException("Animal report not found or does not exist");
        }

        $this->entityManager->remove($report);
        $this->entityManager->flush();
    }
}

?>