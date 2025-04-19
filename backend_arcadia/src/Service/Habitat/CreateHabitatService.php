<?php

namespace App\Service\Habitat;

use App\Entity\Habitat;
use App\Repository\HabitatRepository;
use App\DTO\Habitat\{HabitatDTO, HabitatReadDTO};
use App\Service\ValidationService;
use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

class CreateHabitatService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private ValidationService $validationService
    ) {}

    public function createHabitat(HabitatDTO $habitatCreateDTO): HabitatReadDTO
    {
        $this->validationService->validate($habitatCreateDTO, ['create']);

        $habitat = new Habitat();
        $habitat->setName($habitatCreateDTO->name);
        $habitat->setDescription($habitatCreateDTO->description);

        $habitat->setCreatedAt(new DateTimeImmutable());

        $this->entityManager->persist($habitat);
        $this->entityManager->flush();

        return HabitatReadDTO::fromEntity($habitat);
    }
}


?>