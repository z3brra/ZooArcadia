<?php

namespace App\DTO;

use App\Entity\Species;
use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

class SpeciesReadDTO
{
    #[Groups(['species:read'])]
    public string $uuid;

    #[Groups(['species:read'])]
    public string $commonName;

    #[Groups(['species:read'])]
    public string $scientificName;

    #[Groups(['species:read'])]
    public string $lifespan;

    #[Groups(['species:read'])]
    public string $diet;

    #[Groups(['species:read'])]
    public string $description;

    #[Groups(['species:read'])]
    public DateTimeImmutable $createdAt;

    #[Groups(['species:read'])]
    public ?DateTimeImmutable $updatedAt;

    public function __construct(
        string $uuid,
        string $commonName,
        string $scientificName,
        string $lifespan,
        string $diet,
        string $description,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt = null
    ) {
        $this->uuid = $uuid;
        $this->commonName = $commonName;
        $this->scientificName = $scientificName;
        $this->lifespan = $lifespan;
        $this->diet = $diet;
        $this->description = $description;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public static function fromEntity(Species $species): self
    {
        return new self(
            $species->getUuid(),
            $species->getCommonName(),
            $species->getScientificName(),
            $species->getLifespan(),
            $species->getDiet(),
            $species->getDescription(),
            $species->getCreatedAt(),
            $species->getUpdatedAt()
        );
    }
}

?>