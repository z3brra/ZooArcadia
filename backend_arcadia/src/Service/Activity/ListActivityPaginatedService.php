<?php

namespace App\Service\Activity;

use App\Repository\ActivityRepository;
use App\DTO\Activity\ActivityReadDTO;

use Doctrine\ORM\EntityManagerInterface;

class ListActivityPaginatedService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private ActivityRepository $activityRepository
    ) {}

    public function listActivityPaginated(int $page, int $limit): array
    {
        $result = $this->activityRepository->findPaginated($page, $limit);

        $activityDTOs = [];
        foreach ($result['data'] as $activity) {
            $activityDTOs[] = ActivityReadDTO::fromEntity($activity, false);
        }

        return [
            'data' => $activityDTOs,
            'total' => $result['total'],
            'totalPages' => $result['totalPages'],
            'currentPage' => $result['currentPage'],
            'perPage' => $result['perPage']
        ];
    }
}

?>
