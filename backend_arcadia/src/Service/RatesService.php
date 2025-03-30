<?php

namespace App\Service;

use App\Entity\Rates;
use App\Repository\RatesRepository;
use App\DTO\{RatesDTO, RatesReadDTO};

use App\Repository\ActivityRepository;

use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

use App\Exception\ValidationException;
use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

class RatesService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private RatesRepository $ratesRepository,
        private ActivityRepository $activityRepository,

        private ValidatorInterface $validator
    ) {}

    public function createRates(RatesDTO $ratesCreateDTO): RatesReadDTO
    {
        $validationErrors = $this->validateDTO($ratesCreateDTO, ['create']);
        if (!empty($validationErrors)) {
            throw new ValidationException($validationErrors);
        }

        $activity = $this->activityRepository->findOneByUuid($ratesCreateDTO->activityUuid);
        if (!$activity) {
            throw new NotFoundHttpException("Activity not found with UUID : " . $ratesCreateDTO->activityUuid);
        }

        $rates = new Rates();
        $rates->setTitle($ratesCreateDTO->title);
        $rates->setPrice($ratesCreateDTO->price);
        $rates->setActivity($activity);

        $rates->setCreatedAt(new DateTimeImmutable());

        $this->entityManager->persist($rates);
        $this->entityManager->flush();

        return RatesReadDTO::fromEntity($rates);
    }

    public function showRates(string $uuid): RatesReadDTO
    {
        $rates = $this->ratesRepository->findOneByUuid($uuid);
        if (!$rates) {
            throw new NotFoundHttpException("Rates not found or does not exist");
        }

        return RatesReadDTO::fromEntity($rates);
    }

    public function updateRates(string $uuid, RatesDTO $ratesUpdateDTO): RatesReadDTO
    {
        $rates = $this->ratesRepository->findOneByUuid($uuid);
        if (!$rates) {
            throw new NotFoundHttpException("Rates not found or does not exist");
        }

        if ($ratesUpdateDTO->isEmpty()) {
            throw new BadRequestHttpException("No data to update");
        }

        $validationErrors = $this->validateDTO($ratesUpdateDTO, ['update']);
        if (!empty($validationErrors)) {
            throw new ValidationException($validationErrors);
        }

        $title = $ratesUpdateDTO->title;
        $price = $ratesUpdateDTO->price;

        if ($title !== null) {
            $rates->setTitle($title);
        }
        if ($price !== null) {
            $rates->setPrice($price);
        }

        $rates->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->flush();

        return RatesReadDTO::fromEntity($rates);
    }

    public function deleteRates(string $uuid): void
    {
        $rates = $this->ratesRepository->findOneByUuid($uuid);
        if (!$rates) {
            throw new NotFoundHttpException("Rate not found or does not exist");
        }

        $this->entityManager->remove($rates);
        $this->entityManager->flush();
    }

    private function validateDTO(RatesDTO $dto, array $groups): array
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
