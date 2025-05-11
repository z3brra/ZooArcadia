<?php

namespace App\Service\HabitatReport;

use App\Entity\HabitatReport;
use App\Repository\{UserRepository, HabitatRepository};
use App\DTO\HabitatReport\{HabitatReportDTO, HabitatReportReadDTO};
use App\Service\ValidationService;
use DateTimeImmutable;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Bundle\SecurityBundle\Security;

class CreateHabitatReportService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private UserRepository $userRepository,
        private HabitatRepository $habitatRepository,

        private ValidationService $validationService,

        private Security $security
    ) {}

    public function createReport(HabitatReportDTO $reportCreateDTO): HabitatReportReadDTO
    {
        $this->validationService->validate($reportCreateDTO, ['create']);

        $habitat = $this->habitatRepository->findOneByUuid($reportCreateDTO->habitatUuid);
        if (!$habitat) {
            throw new NotFoundHttpException("Habitat not found with UUID : " . $reportCreateDTO->habitatUuid);
        }

        $user = $this->security->getUser();
        if (!$user) {
            throw new NotFoundHttpException("No authenticated user found");
        }

        $habitatReport = new HabitatReport();
        $habitatReport->setHabitat($habitat);
        $habitatReport->setCreatedBy($user);
        $habitatReport->setState($reportCreateDTO->state);
        $habitatReport->setComment($reportCreateDTO->comment);

        $habitatReport->setCreatedAt(new DateTimeImmutable());

        $habitat->setLastState($reportCreateDTO->state);

        $this->entityManager->persist($habitatReport);
        $this->entityManager->flush();

        return HabitatReportReadDTO::fromEntity($habitatReport);
    }
}

?>