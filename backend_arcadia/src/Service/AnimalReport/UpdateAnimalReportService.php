<?php

namespace App\Service\AnimalReport;

use App\Repository\AnimalReportRepository;
use App\DTO\AnimalReport\{AnimalReportDTO, AnimalReportReadDTO};
use App\Service\ValidationService;
use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

class UpdateAnimalReportService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AnimalReportRepository $animalReportRepository,
        private ValidationService $validationService
    ) {}

    public function updateReport(string $uuid, AnimalReportDTO $reportUpdateDTO): AnimalReportReadDTO
    {
        $report = $this->animalReportRepository->findOneByUuid($uuid);
        if (!$report) {
            throw new NotFoundHttpException("Animal report not found or does not exist");
        }

        if ($reportUpdateDTO->isEmpty()) {
            throw new BadRequestHttpException("No data to update");
        }

        $this->validationService->validate($reportUpdateDTO, ['update']);

        $state = $reportUpdateDTO->state;
        $comment = $reportUpdateDTO->comment;
        $recommandedFood = $reportUpdateDTO->recommandedFood;

        if ($state !== null) {
            $report->setState($state);
        }

        if ($comment !== null) {
            $report->setComment($comment);
        }

        if (!empty($recommandedFood)) {
            $report->setRecommandedFood($recommandedFood);
        }

        $report->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->flush();

        return AnimalReportReadDTO::fromEntity($report);
    }
}

?>