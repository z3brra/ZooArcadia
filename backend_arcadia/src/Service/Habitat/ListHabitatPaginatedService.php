<?php

namespace App\Service\Habitat;

use App\Repository\HabitatRepository;
use App\DTO\Habitat\HabitatReadDTO;

use Doctrine\ORM\EntityManagerInterface;

class ListHabitatPaginatedService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private HabitatRepository $habitatRepository
    ) {}

    public function listHabitatPaginated(int $page = 1, int $limit = 10): array
    {
        $result = $this->habitatRepository->findPaginated($page, $limit);

        $habitatDTOs = [];
        foreach ($result['data'] as $habitat) {
            $habitatDTOs[] = HabitatReadDTO::fromEntity($habitat, true);
        }

        return [
            'data' => $habitatDTOs,
            'total' => $result['total'],
            'totalPages' => $result['totalPages'],
            'currentPage' => $result['currentPage'],
            'perPage' => $result['perPage']
        ];
    }
}

?>