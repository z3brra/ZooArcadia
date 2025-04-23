<?php

namespace App\DTO\Habitat;

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

    #[Groups(['habitat:with-animalCount'])]
    public ?int $animalCount;

    public function __construct(
        string $uuid,
        string $name,
        ?string $description = null,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt = null,
        ?int $animalCount = null,
    ) {
        $this->uuid = $uuid;
        $this->name = $name;
        $this->description = $description;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->animalCount = $animalCount;
    }

    public static function fromEntity(Habitat $habitat, bool $withAnimalCount = false): self
    {
        if ($withAnimalCount) {
            $animals = $habitat->getAnimals();
            $animalCount = count($animals);
            // foreach ($animals as $animial) {
            //     $animalCount += 1;
            // }

            return new self(
                $habitat->getUuid(),
                $habitat->getName(),
                $habitat->getDescription(),
                $habitat->getCreatedAt(),
                $habitat->getUpdatedAt(),
                $animalCount
            );
        }

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