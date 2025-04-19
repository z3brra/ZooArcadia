<?php

namespace App\Service\Species;

use App\Repository\SpeciesRepository;
use App\DTO\Species\{SpeciesDTO, SpeciesReadDTO};
use App\Service\ValidationService;
use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

class UpdateSpeciesService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SpeciesRepository $speciesRepository,

        private ValidationService $validationService
    ) {}

    public function updateSpecies(string $uuid, SpeciesDTO $speciesUpdateDTO): SpeciesReadDTO
    {
        $species = $this->speciesRepository->findOneByUuid($uuid);

        if (!$species) {
            throw new NotFoundHttpException("Species not found or does not exist");
        }

        if ($speciesUpdateDTO->isEmpty()) {
            throw new BadRequestHttpException("No data to update");
        }

        $this->validationService->validate($speciesUpdateDTO, ['update']);

        $commonName = $speciesUpdateDTO->commonName;
        $scientificName = $speciesUpdateDTO->scientificName;
        $lifespan = $speciesUpdateDTO->lifespan;
        $diet = $speciesUpdateDTO->diet;
        $description = $speciesUpdateDTO->description;

        if ($commonName !== null) {
            $species->setCommonName($commonName);
        }
        if ($scientificName !== null) {
            $species->setScientificName($scientificName);
        }
        if ($lifespan !== null) {
            $species->setLifespan($lifespan);
        }
        if ($diet !== null) {
            $species->setDiet($diet);
        }
        if ($description !== null) {
            $species->setDescription($description);
        }

        $species->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return SpeciesReadDTO::fromEntity($species);
    }
}


?>