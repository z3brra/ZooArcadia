<?php

namespace App\Service\Activity;

use App\Repository\ActivityRepository;
use App\DTO\Activity\{ActivityDTO, ActivityReadDTO};
use App\Service\ValidationService;
use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

class UpdateActivityService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ActivityRepository $activityRepository,

        private ValidationService $validationService
    ) {}

    public function updateActivity(string $uuid, ActivityDTO $activityUpdateDTO): ActivityReadDTO
    {
        $activity = $this->activityRepository->findOneByUuid($uuid);
        if (!$activity) {
            throw new NotFoundHttpException("Activity not found or does not exist");
        }

        if ($activityUpdateDTO->isEmpty()) {
            throw new BadRequestHttpException("No data to update");
        }

        $this->validationService->validate($activityUpdateDTO, ['update']);

        $name = $activityUpdateDTO->name;
        $description = $activityUpdateDTO->description;

        if ($name !== null) {
            $activity->setName($name);
        }
        if ($description !== null) {
            $activity->setDescription($description);
        }

        $activity->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->flush();

        return ActivityReadDTO::fromEntity($activity, true);
    }
}


?>
