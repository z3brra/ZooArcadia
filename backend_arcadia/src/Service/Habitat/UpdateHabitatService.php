<?php

namespace App\Service\Habitat;

use App\Repository\HabitatRepository;
use App\DTO\Habitat\{HabitatDTO, HabitatReadDTO};
use App\Service\ValidationService;
use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

class UpdateHabitatService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private HabitatRepository $habitatRepository,

        private ValidationService $validationService
    ) {}

    public function updateHabitat(string $uuid, HabitatDTO $habitatUpdateDTO): HabitatReadDTO
    {
        $habitat = $this->habitatRepository->findOneByUuid($uuid);
        if (!$habitat) {
            throw new NotFoundHttpException("Habitat not found or does not exist");
        }

        if ($habitatUpdateDTO->isEmpty()) {
            throw new BadRequestHttpException("No data to update");
        }

        $this->validationService->validate($habitatUpdateDTO, ['update']);

        $name = $habitatUpdateDTO->name;
        $description = $habitatUpdateDTO->description;

        if ($name !== null) {
            $habitat->setName($name);
        }

        if ($description !== null) {
            $habitat->setDescription($description);
        }

        $habitat->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->flush();

        return HabitatReadDTO::fromEntity($habitat);
    }
}

?>