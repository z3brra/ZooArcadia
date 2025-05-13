<?php

namespace App\Repository;

use App\Entity\AnimalReport;
use App\Entity\Animal;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AnimalReport>
 */
class AnimalReportRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AnimalReport::class);
    }

    public function findOneByUuid(string $uuid): ?AnimalReport
    {
        return $this->findOneBy(['uuid' => $uuid]);
    }

    public function findPaginated(int $page = 1, int $limit = 10): array
    {
        $query = $this->createQueryBuilder('animalReport')
            ->orderBy('animalReport.createdAt', 'DESC')
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

    // A voir si ça fonctionne correctement quand j'aurais fait la gestion des repas animaux
    public function findLatestRecommandedFoodByAnimal(Animal $animal): array
    {
        $query = $this->createQueryBuilder('animalReport')
            ->andWhere('animalReport.animal = :animal')
            ->setParameter('animal', $animal)
            ->orderBy('animalReport.createdAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        return $query?->getRecommandedFood() ?? [];
    }

    //    /**
    //     * @return AnimalReport[] Returns an array of AnimalReport objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('a.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?AnimalReport
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
