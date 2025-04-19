<?php

namespace App\Service\Rates;

use App\Entity\Rates;
use App\Repository\{RatesRepository, ActivityRepository};
use App\DTO\Rates\{RatesDTO, RatesReadDTO};
use App\Service\ValidationService;
use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CreateRatesService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private ActivityRepository $activityRepository,

        private ValidationService $validationService
    ) {}

    public function createRates(RatesDTO $ratesCreateDTO): RatesReadDTO
    {
        $this->validationService->validate($ratesCreateDTO, ['create']);

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
}



?>