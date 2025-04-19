<?php

namespace App\Service\Habitat;

use App\Repository\HabitatRepository;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DeleteHabitatService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private HabitatRepository $habitatRepository
    ) {}

    public function deleteHabitat(string $uuid): void
    {
        $habitat = $this->habitatRepository->findOneByUuid($uuid);
        if (!$habitat) {
            throw new NotFoundHttpException("Habitat not found or does not exist");
        }

        foreach ($habitat->getAnimals() as $animal) {
            $animal->setHabitat(null);
        }

        $this->entityManager->remove($habitat);
        $this->entityManager->flush();
    }
}

?>