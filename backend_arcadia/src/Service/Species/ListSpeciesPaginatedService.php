<?php

namespace App\Service\Species;


use App\Repository\SpeciesRepository;
use App\DTO\Species\SpeciesReadDTO;

use Doctrine\ORM\EntityManagerInterface;

class ListSpeciesPaginatedService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private SpeciesRepository $speciesRepository
    ) {}

    public function listSpeciesPaginated(int $page, int $limit): array
    {
        $result = $this->speciesRepository->findPaginated($page, $limit);

        $speciesDTOs = [];
        foreach ($result['data'] as $species) {
            $speciesDTOs[] = SpeciesReadDTO::fromEntity($species, true);
        }

        return [
            'data' => $speciesDTOs,
            'total' => $result['total'],
            'totalPages' => $result['totalPages'],
            'currentPage' => $result['currentPage'],
            'perPage' => $result['perPage'],
        ];
    }
}

?>