<?php

namespace App\Service\Species;

use App\Repository\SpeciesRepository;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DeleteSpeciesService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SpeciesRepository $speciesRepository
    ) {}

    public function deleteSpecies(string $uuid): void
    {
        $species = $this->speciesRepository->findOneByUuid($uuid);

        if (!$species) {
            throw new NotFoundHttpException("Species not found or does not exist");
        }

        $this->entityManager->remove($species);
        $this->entityManager->flush();
    }
}

?>