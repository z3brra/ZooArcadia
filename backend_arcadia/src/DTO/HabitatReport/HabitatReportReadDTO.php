<?php

namespace App\DTO\HabitatReport;

use App\Entity\HabitatReport;

use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

class HabitatReportReadDTO
{
    #[Groups(['habitat-report:read', 'habitat-report:list'])]
    public string $uuid;

    #[Groups(['habitat-report:read'])]
    public string $habitatUuid;

    #[Groups(['habitat-report:read', 'habitat-report:list'])]
    public string $habitatName;

    #[Groups(['habitat-report:read'])]
    public string $createdByUuid;

    #[Groups(['habitat-report:read', 'habitat-report:list'])]
    public string $userLastName;

    #[Groups(['habitat-report:read', 'habitat-report:list'])]
    public string $userFirstName;

    #[Groups(['habitat-report:read', 'habitat-report:list'])]
    public string $state;

    #[Groups(['habitat-report:read'])]
    public ?string $comment;

    #[Groups(['habitat-report:read', 'habitat-report:list'])]
    public DateTimeImmutable $createdAt;

    #[Groups(['habitat-report:read'])]
    public ?DateTimeImmutable $updatedAt;

    public function __construct(
        string $uuid,
        string $habitatUuid,
        string $habitatName,
        string $createdByUuid,
        string $userLastName,
        string $userFirstName,
        string $state,
        ?string $comment = null,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt = null
    )
    {
        $this->uuid = $uuid;
        $this->habitatUuid = $habitatUuid;
        $this->habitatName = $habitatName;
        $this->createdByUuid = $createdByUuid;
        $this->userLastName = $userLastName;
        $this->userFirstName = $userFirstName;
        $this->state = $state;
        $this->comment = $comment;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public static function fromEntity(HabitatReport $habitatReport): self
    {
        return new self(
            $habitatReport->getUuid(),
            $habitatReport->getHabitat()->getUuid(),
            $habitatReport->getHabitat()->getName(),
            $habitatReport->getCreatedBy()->getUuid(),
            $habitatReport->getCreatedBy()->getLastName(),
            $habitatReport->getCreatedBy()->getFirstName(),
            $habitatReport->getState(),
            $habitatReport->getComment(),
            $habitatReport->getCreatedAt(),
            $habitatReport->getUpdatedAt()
        );
    }

}

?>
