<?php

namespace App\Service\AnimalReport;


use App\Entity\AnimalReport;
use App\DTO\AnimalReport\{AnimalReportDTO, AnimalReportReadDTO};
use App\Repository\AnimalRepository;
use App\Service\ValidationService;
use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Bundle\SecurityBundle\Security;

class CreateAnimalReportService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private AnimalRepository $animalRepository,

        private ValidationService $validationService,

        private Security $security
    ) {}

    public function createReport(AnimalReportDTO $reportCreateDTO): AnimalReportReadDTO
    {
        $this->validationService->validate($reportCreateDTO, ['create']);

        $animal = $this->animalRepository->findOneByUuid($reportCreateDTO->animalUuid);
        if (!$animal) {
            throw new NotFoundHttpException("Animal not found with UUID : " . $reportCreateDTO->animalUuid);
        }

        $user = $this->security->getUser();
        if (!$user) {
            throw new NotFoundHttpException("No authenticated user found");
        }

        $animalReport = new AnimalReport();
        $animalReport->setAnimal($animal);
        $animalReport->setCreatedBy($user);
        $animalReport->setState($reportCreateDTO->state);
        $animalReport->setComment($reportCreateDTO->comment);
        $animalReport->setRecommandedFood($reportCreateDTO->recommandedFood);

        $animalReport->setCreatedAt(new DateTimeImmutable());

        $animal->setLastState($reportCreateDTO->state);

        $this->entityManager->persist($animalReport);
        $this->entityManager->flush();

        return AnimalReportReadDTO::fromEntity($animalReport);
    }
}

?>