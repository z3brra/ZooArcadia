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
        
        private ValidatorInterface $validator,
        private ValidationService $validationService

    ) {}

    public function createActivity(ActivityDTO $activityCreateDTO): ActivityReadDTO
    {
        // $validationErrors = $this->validateDTO($activityCreateDTO, ['create']);
        // if (!empty($validationErrors)) {
        //     throw new ValidationException($validationErrors);
        // }

        $this->validationService->validate($activityCreateDTO, ['create']);

        $activity = new Activity();
        $activity->setName($activityCreateDTO->name);
        $activity->setDescription($activityCreateDTO->description);

        $activity->setCreatedAt(new DateTimeImmutable());

        $this->entityManager->persist($activity);
        $this->entityManager->flush();

        return ActivityReadDTO::fromEntity($activity, true);
    }

    public function showActivity(string $uuid): ActivityReadDTO
    {
        $activity = $this->activityRepository->findOneByUuid($uuid);
        if (!$activity) {
            throw new NotFoundHttpException("Activity not found or does not exist");
        }

        return ActivityReadDTO::fromEntity($activity, true);
    }

    public function updateActivity(string $uuid, ActivityDTO $activityUpdateDTO): ActivityReadDTO
    {
        $activity = $this->activityRepository->findOneByUuid($uuid);
        if (!$activity) {
            throw new NotFoundHttpException("Activity not found or does not exist");
        }

        if ($activityUpdateDTO->isEmpty()) {
            throw new BadRequestHttpException("No data to update");
        }

        $errors = $this->validateDTO($activityUpdateDTO, ['update']);
        if (!empty($validationErrors)) {
            throw new ValidationException($validationErrors);
        }

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

    public function deleteActivity(string $uuid): void
    {
        $activity = $this->activityRepository->findOneByUuid($uuid);
        if (!$activity) {
            throw new NotFoundHttpException("Activity not found or does not exist");
        }

        $this->entityManager->remove($activity);
        $this->entityManager->flush();
    }

    public function listActivityPaginated(int $page, int $limit): array
    {
        $result = $this->activityRepository->findPaginated($page, $limit);

        $activityDTOs = [];
        foreach ($result['data'] as $activity) {
            $activityDTOs[] = ActivityReadDTO::fromEntity($activity, false);
        }

        return [
            'data' => $activityDTOs,
            'total' => $result['total'],
            'totalPages' => $result['totalPages'],
            'currentPage' => $result['currentPage'],
            'perPage' => $result['perPage']
        ];
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