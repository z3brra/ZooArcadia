<?php

namespace App\DTO;

use App\Entity\Activity;
use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

class ActivityReadDTO
{
    #[Groups(['activity:read'])]
    public string $uuid;

    #[Groups(['activity:read'])]
    public string $name;

    #[Groups(['activity:read'])]
    public ?string $description;

    #[Groups(['activity:read'])]
    public DateTimeImmutable $createdAt;

    #[Groups(['activity:read'])]
    public ?DateTimeImmutable $updatedAt;

    public function __construct(
        string $uuid,
        string $name,
        ?string $description = null,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt = null
    ) {
        $this->uuid = $uuid;
        $this->name = $name;
        $this->description = $description;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public static function fromEntity(Activity $activity): self
    {
        return new self(
            $activity->getUuid(),
            $activity->getName(),
            $activity->getDescription(),
            $activity->getCreatedAt(),
            $activity->getUpdatedAt()
        );
    }
}

?>
