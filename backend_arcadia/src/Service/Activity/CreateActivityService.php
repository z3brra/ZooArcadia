<?php

namespace App\Service\Activity;

use App\Entity\Activity;
use App\Repository\ActivityRepository;
use App\DTO\Activity\{ActivityDTO, ActivityReadDTO};
use App\Service\ValidationService;
use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

class CreateActivityService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private ValidationService $validationService
    ) {}

    public function createActivity(ActivityDTO $activityCreateDTO): ActivityReadDTO
    {
        $this->validationService->validate($activityCreateDTO, ['create']);

        $activity = new Activity();
        $activity->setName($activityCreateDTO->name);
        $activity->setDescription($activityCreateDTO->description);

        $activity->setCreatedAt(new DateTimeImmutable());

        $this->entityManager->persist($activity);
        $this->entityManager->flush();

        return ActivityReadDTO::fromEntity($activity, true);
    }
}

?>
