<?php

namespace App\Service\Species;

use App\Entity\Species;
use App\Repository\SpeciesRepository;
use App\DTO\Species\{SpeciesDTO, SpeciesReadDTO};
use App\Service\ValidationService;
use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

class CreateSpeciesService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private ValidationService $validationService
    ) {}

    public function createSpecies(SpeciesDTO $speciesCreateDTO): SpeciesReadDTO
    {
        $this->validationService->validate($speciesCreateDTO, ['create']);

        $species = new Species();
        $species->setCommonName($speciesCreateDTO->commonName);
        $species->setScientificName($speciesCreateDTO->scientificName);
        $species->setLifespan($speciesCreateDTO->lifespan);
        $species->setDiet($speciesCreateDTO->diet);
        $species->setDescription($speciesCreateDTO->description);

        $species->setCreatedAt(new DateTimeImmutable());

        $this->entityManager->persist($species);
        $this->entityManager->flush();

        return SpeciesReadDTO::fromEntity($species);
    }
}

?>