<?php

namespace App\Service;

use App\Entity\Activity;
use App\Repository\ActivityRepository;
use App\DTO\{ActivityDTO, ActivityReadDTO};

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

use App\Exception\ValidationException;
use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

use DateTimeImmutable;

class ActivityService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ActivityRepository $activityRepository,
        private ValidatorInterface $validator
    ) {}

    public function createActivity(ActivityDTO $activityCreateDTO): ActivityReadDTO
    {
        $validationErrors = $this->validateDTO($activityCreateDTO, ['create']);
        if (empty($validationErrors)) {
            throw new ValidationException($validationErrors);
        }

        $activity = new Activity();
        $activity->setName($activityCreateDTO->name);
        $activity->setDescription($activityCreateDTO->description);

        $activity->setCreatedAt(new DateTimeImmutable());

        $this->entityManager->persist($activity);
        $this->entityManager->flush();

        return ActivityReadDTO::fromEntity($activity);
    }

    public function showActivity(string $uuid): ActivityReadDTO
    {
        $activity = $this->activityRepository->findOneByUuid($uuid);
        if (!$activity) {
            throw new NotFoundHttpException("Activity not found or does not exist");
        }

        return ActivityReadDTO::fromEntity($activity);
    }

    private function validateDTO(ActivityDTO $dto, array $groups): array
    {
        $validationErrors = [];
        $errors = $this->validator->validate($dto, null, $groups);
        if (count($errors) > 0) {
            foreach ($errors as $error) {
                $validationErrors[] = $error->getMessage();
            }
        }
        return $validationErrors;
    }

}

?>