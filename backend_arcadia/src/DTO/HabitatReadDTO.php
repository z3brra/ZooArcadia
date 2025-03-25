<?php

namespace App\DTO;

use App\Entity\Habitat;
use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

class HabitatReadDTO
{
    #[Groups(['habitat:read'])]
    public string $uuid;

    #[Groups(['habitat:read'])]
    public string $name;

    #[Groups(['habitat:read'])]
    public ?string $description;

    #[Groups(['habitat:read'])]
    public DateTimeImmutable $createdAt;

    #[Groups(['habitat:read'])]
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

    public static function fromEntity(Habitat $habitat): self
    {
        return new self(
            $habitat->getUuid(),
            $habitat->getName(),
            $habitat->getDescription(),
            $habitat->getCreatedAt(),
            $habitat->getUpdatedAt()
        );
    }

}

?>