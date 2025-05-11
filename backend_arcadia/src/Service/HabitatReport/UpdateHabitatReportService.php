<?php

namespace App\Service\HabitatReport;

use App\Repository\HabitatReportRepository;
use App\DTO\HabitatReport\{HabitatReportDTO, HabitatReportReadDTO};
use App\Service\ValidationService;
use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

class UpdateHabitatReportService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private HabitatReportRepository $habitatReportRepository,
        private ValidationService $validationService
    ) {}

    public function updateReport(string $uuid, HabitatReportDTO $reportUpdateDTO): HabitatReportReadDTO
    {
        $report = $this->habitatReportRepository->findOneByUuid($uuid);
        if (!$report) {
            throw new NotFoundHttpException("Habitat report not found or does not exist");
        }

        if ($reportUpdateDTO->isEmpty()) {
            throw new BadRequestHttpException("No data to update");
        }

        $this->validationService->validate($reportUpdateDTO, ['update']);

        $state = $reportUpdateDTO->state;
        $comment = $reportUpdateDTO->comment;

        if ($state !== null) {
            $report->setState($state);
        }
        if ($comment !== null) {
            $report->setComment($comment);
        }

        $report->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->flush();

        return HabitatReportReadDTO::fromEntity($report);
    }
}

?>
