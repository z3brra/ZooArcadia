<?php

namespace App\Repository;

use App\Entity\HabitatReport;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<HabitatReport>
 */
class HabitatReportRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, HabitatReport::class);
    }

    public function findOneByUuid(string $uuid): ?HabitatReport
    {
        return $this->findOneBy(['uuid' => $uuid]);
    }

    public function findPaginated(int $page = 1, int $limit = 10): array
    {
        $query = $this->createQueryBuilder('habitatReport')
            ->orderBy('habitatReport.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery();

        $paginator = new Paginator($query);
        $total = count($paginator);
        $totalPages = (int) ceil($total / $limit);

        return [
            'data' => iterator_to_array($paginator->getIterator()),
            'total' => count($paginator),
            'totalPages' => $totalPages,
            'currentPage' => $page,
            'perPage' => $limit
        ];
    }
    //    /**
    //     * @return HabitatReport[] Returns an array of HabitatReport objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('h')
    //            ->andWhere('h.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('h.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?HabitatReport
    //    {
    //        return $this->createQueryBuilder('h')
    //            ->andWhere('h.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
