<?php

namespace App\Service\Rates;


use App\Repository\RatesRepository;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DeleteRatesService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private RatesRepository $ratesRepository
    ) {}

    public function deleteRates(string $uuid): void
    {
        $rates = $this->ratesRepository->findOneByUuid($uuid);
        if (!$rates) {
            throw new NotFoundHttpException("Rate not found or does not exist");
        }

        $this->entityManager->remove($rates);
        $this->entityManager->flush();
    }
}


?>