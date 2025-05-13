<?php

namespace App\Service\AnimalReport;

use App\Repository\AnimalReportRepository;
use App\DTO\AnimalReport\AnimalReportReadDTO;

use Doctrine\ORM\EntityManagerInterface;

class ListAnimalReportPaginatedService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AnimalReportRepository $animalReportRepository
    ) {}

    public function listReportPaginated(int $page = 1, int $limit = 10): array
    {
        $result = $this->animalReportRepository->findPaginated($page, $limit);

        $reportDTOs = [];
        foreach($result['data'] as $report) {
            $reportDTOs[] = AnimalReportReadDTO::fromEntity($report);
        }

        return [
            'data' => $reportDTOs,
            'total' => $result['total'],
            'totalPages' => $result['totalPages'],
            'currentPage' => $result['currentPage'],
            'perPage' => $result['perPage']
        ];
    }
}

?>