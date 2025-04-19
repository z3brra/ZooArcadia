<?php

namespace App\Service\Activity;

use App\Repository\ActivityRepository;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DeleteActivityService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private ActivityRepository $activityRepository
    ) {}

    public function deleteActivity(string $uuid): void
    {
        $activity = $this->activityRepository->findOneByUuid($uuid);
        if (!$activity) {
            throw new NotFoundHttpException("Activity not found or does not exist");
        }

        $this->entityManager->remove($activity);
        $this->entityManager->flush();
    }
}


?>
