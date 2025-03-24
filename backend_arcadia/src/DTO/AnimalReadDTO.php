<?php

namespace App\DTO;

use App\Entity\Animal;
use DateTimeImmutable;
use DateTimeInterface;
use Symfony\Component\Serializer\Annotation\Groups;

class AnimalReadDTO
{
    #[Groups(['animal:read'])]
    public string $uuid;

    #[Groups(['animal:read', 'species:with-animals'])]
    public string $name;

    #[Groups(['animal:read', 'species:with-animals'])]
    public bool $isMale;

    #[Groups(['animal:read', 'species:with-animals'])]
    public int $size;

    #[Groups(['animal:read', 'species:with-animals'])]
    public int $weight;

    #[Groups(['animal:read'])]
    public bool $isFertile;

    #[Groups(['animal:read'])]
    public DateTimeInterface $birthDate;

    #[Groups(['animal:read'])]
    public DateTimeInterface $arrivalDate;

    #[Groups(['animal:read'])]
    public DateTimeImmutable $createdAt;

    #[Groups(['animal:read'])]
    public ?DateTimeImmutable $updatedAt;

    #[Groups(['animal:read'])]
    public string $speciesUuid;

    public function __construct(
        string $uuid,
        string $name,
        bool $isMale,
        int $size,
        int $weight,
        bool $isFertile,
        DateTimeInterface $birthDate,
        DateTimeInterface $arrivalDate,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt = null,
        string $speciesUuid
    ) {
        $this->uuid = $uuid;
        $this->name = $name;
        $this->isMale = $isMale;
        $this->size = $size;
        $this->weight = $weight;
        $this->isFertile = $isFertile;
        $this->birthDate = $birthDate;
        $this->arrivalDate = $arrivalDate;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->speciesUuid = $speciesUuid;
    }

    public static function fromEntity(Animal $animal): self
    {
        return new self(
            $animal->getUuid(),
            $animal->getName(),
            $animal->isMale(),
            $animal->getSize(),
            $animal->getWeight(),
            $animal->isFertile(),
            $animal->getBirthDate(),
            $animal->getArrivalDate(),
            $animal->getCreatedAt(),
            $animal->getUpdatedAt(),
            $animal->getSpecies()->getUuid()
        );
    }
}

?>