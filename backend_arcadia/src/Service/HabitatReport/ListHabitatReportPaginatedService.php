<?php

namespace App\Service\HabitatReport;

use App\Repository\HabitatReportRepository;
use App\DTO\HabitatReport\HabitatReportReadDTO;

use Doctrine\ORM\EntityManagerInterface;

class ListHabitatReportPaginatedService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private HabitatReportRepository $habitatReportRepository
    ) {}

    public function listReportPaginated(int $page = 1, int $limit = 10): array
    {
        $result = $this->habitatReportRepository->findPaginated($page, $limit);

        $reportDTOs = [];
        foreach($result['data'] as $report) {
            $reportDTOs[] = HabitatReportReadDTO::fromEntity($report);
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