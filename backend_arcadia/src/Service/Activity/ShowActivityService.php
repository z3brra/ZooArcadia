<?php

namespace App\Service\Activity;

use App\Repository\ActivityRepository;
use App\DTO\Activity\ActivityReadDTO;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ShowActivityService
{
    public function __construct(
        private ActivityRepository $activityRepository,
    ) {}

    public function showActivity(string $uuid): ActivityReadDTO
    {
        $activity = $this->activityRepository->findOneByUuid($uuid);
        if (!$activity) {
            throw new NotFoundHttpException("Activity not found or does not exist");
        }

        return ActivityReadDTO::fromEntity($activity, true);
    }
}

?>
