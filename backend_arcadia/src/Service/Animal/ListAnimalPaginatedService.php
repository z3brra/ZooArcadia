<?php

namespace App\Service\Animal;

use App\Repository\AnimalRepository;
use App\DTO\Animal\AnimalReadDTO;

use Doctrine\ORM\EntityManagerInterface;

class ListAnimalPaginatedService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AnimalRepository $animalRepository,
    ) {}

    public function listAnimalPaginated(int $page, int $limit): array
    {
        $result = $this->animalRepository->findPaginated($page, $limit);

        $animalDTOs = [];
        foreach ($result['data'] as $animal) {
            $animalDTOs[] = AnimalReadDTO::fromEntity($animal);
        }

        return [
            'data' => $animalDTOs,
            'total' => $result['total'],
            'totalPages' => $result['totalPages'],
            'currentPage' => $result['currentPage'],
            'perPage' => $result['perPage']
        ];
    }
}

?>