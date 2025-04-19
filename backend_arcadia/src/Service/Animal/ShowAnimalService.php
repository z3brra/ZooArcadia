<?php

namespace App\Service\Animal;

use App\Repository\AnimalRepository;
use App\DTO\Animal\AnimalReadDTO;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ShowAnimalService
{
    public function __construct(
        private AnimalRepository $animalRepository,
    ) {}

    public function showAnimal(string $uuid): AnimalReadDTO
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);

        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }

        return AnimalReadDTO::fromEntity($animal);
    }
}

?>