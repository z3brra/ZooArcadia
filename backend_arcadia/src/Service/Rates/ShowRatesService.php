<?php

namespace App\Service\Rates;

use App\Repository\RatesRepository;
use App\DTO\Rates\RatesReadDTO;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ShowRatesService
{
    public function __construct(
        private RatesRepository $ratesRepository
    ) {}

    public function showRates(string $uuid): RatesReadDTO
    {
        $rates = $this->ratesRepository->findOneByUuid($uuid);
        if (!$rates) {
            throw new NotFoundHttpException("Rates not found or does not exist");
        }

        return RatesReadDTO::fromEntity($rates);
    }
}

?>