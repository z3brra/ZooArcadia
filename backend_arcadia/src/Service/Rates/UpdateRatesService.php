<?php

namespace App\Service\Rates;

use App\Repository\RatesRepository;
use App\DTO\Rates\{RatesDTO, RatesReadDTO};
use App\Service\ValidationService;
use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

class UpdateRatesService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private RatesRepository $ratesRepository,

        private ValidationService $validationService
    ) {}

    public function updateRates(string $uuid, RatesDTO $ratesUpdateDTO): RatesReadDTO
    {
        $rates = $this->ratesRepository->findOneByUuid($uuid);
        if (!$rates) {
            throw new NotFoundHttpException("Rates not found or does not exist");
        }

        if ($ratesUpdateDTO->isEmpty()) {
            throw new BadRequestHttpException("No data to update");
        }

        $this->validationService->validate($ratesUpdateDTO, ['update']);

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
}

?>