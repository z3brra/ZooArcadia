<?php

namespace App\DTO\Species;

use App\Entity\Species;
use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

class SpeciesReadDTO
{
    #[Groups(['species:read', 'species:list', 'species:all'])]
    public string $uuid;

    #[Groups(['species:read', 'species:list', 'species:all'])]
    public string $commonName;

    #[Groups(['species:read', 'species:list'])]
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

    #[Groups(['species:list', 'species:with-animalCount'])]
    public ?int $animalCount;

    public function __construct(
        string $uuid,
        string $commonName,
        string $scientificName,
        string $lifespan,
        string $diet,
        string $description,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt = null,
        ?int $animalCount = null
    ) {
        $this->uuid = $uuid;
        $this->commonName = $commonName;
        $this->scientificName = $scientificName;
        $this->lifespan = $lifespan;
        $this->diet = $diet;
        $this->description = $description;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->animalCount = $animalCount;
    }

    public static function fromEntity(Species $species, bool $withAnimalCount = false): self
    {

        $speciesDTO = new self(
            uuid: $species->getUuid(),
            commonName: $species->getCommonName(),
            scientificName: $species->getScientificName(),
            lifespan: $species->getLifespan(),
            diet: $species->getDiet(),
            description: $species->getDescription(),
            createdAt: $species->getCreatedAt(),
            updatedAt: $species->getUpdatedAt(),
            animalCount: null
        );

        if ($withAnimalCount) {
            $speciesDTO->animalCount = count($species->getAnimals());
        }

        return $speciesDTO;
    }
}

?>