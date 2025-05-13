<?php

namespace App\DTO\AnimalReport;

use App\Entity\AnimalReport;

use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

class AnimalReportReadDTO
{
    #[Groups(['animal-report:read', 'animal-report:list'])]
    public string $uuid;

    #[Groups(['animal-report:read'])]
    public string $animalUuid;

    #[Groups(['animal-report:read', 'animal-report:list'])]
    public string $animalName;

    #[Groups(['animal-report:read'])]
    public string $createdByUuid;

    #[Groups(['animal-report:read', 'animal-report:list'])]
    public string $userLastName;

    #[Groups(['animal-report:read', 'animal-report:list'])]
    public string $userFirstName;

    #[Groups(['animal-report:read', 'animal-report:list'])]
    public string $state;

    #[Groups(['animal-report:read'])]
    public ?string $comment;

    #[Groups(['animal-report:read'])]
    public array $recommandedFood;

    #[Groups(['animal-report:read', 'animal-report:list'])]
    public DateTimeImmutable $createdAt;

    #[Groups(['animal-report:read'])]
    public ?DateTimeImmutable $updatedAt;

    public function __construct(
        string $uuid,
        string $animalUuid,
        string $animalName,
        string $createdByUuid,
        string $userLastName,
        string $userFirstName,
        string $state,
        ?string $comment = null,
        array $recommandedFood,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt
    )
    {
        $this->uuid = $uuid;
        $this->animalUuid = $animalUuid;
        $this->animalName = $animalName;
        $this->createdByUuid = $createdByUuid;
        $this->userLastName = $userLastName;
        $this->userFirstName = $userFirstName;
        $this->state = $state;
        $this->comment = $comment;
        $this->recommandedFood = $recommandedFood;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public static function fromEntity(AnimalReport $animalReport): self
    {
        return new self(
            uuid: $animalReport->getUuid(),
            animalUuid: $animalReport->getAnimal()->getUuid(),
            animalName: $animalReport->getAnimal()->getName(),
            createdByUuid: $animalReport->getCreatedBy()->getUuid(),
            userLastName: $animalReport->getCreatedBy()->getLastName(),
            userFirstName: $animalReport->getCreatedBy()->getFirstName(),
            state: $animalReport->getState(),
            comment: $animalReport->getComment(),
            recommandedFood: $animalReport->getRecommandedFood(),
            createdAt: $animalReport->getCreatedAt(),
            updatedAt: $animalReport->getUpdatedAt()
        );
    }

}

?>
