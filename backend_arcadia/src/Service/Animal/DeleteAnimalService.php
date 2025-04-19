<?php

namespace App\Service\Animal;

use App\Repository\AnimalRepository;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DeleteAnimalService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AnimalRepository $animalRepository,
    ) {}

    public function deleteAnimal(string $uuid): void
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);
        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }

        $this->entityManager->remove($animal);
        $this->entityManager->flush();
    }
}

?>