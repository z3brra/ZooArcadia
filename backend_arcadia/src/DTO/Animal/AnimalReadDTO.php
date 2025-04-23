<?php

namespace App\DTO\Animal;

use App\Entity\Animal;

use App\DTO\Picture\PictureReadDTO;

use DateTimeImmutable;
use DateTimeInterface;
use Symfony\Component\Serializer\Annotation\Groups;

class AnimalReadDTO
{
    #[Groups(['animal:read', 'animal:list'])]
    public string $uuid;

    #[Groups(['animal:read', 'animal:list', 'species:with-animals'])]
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

    #[Groups(['animal:list'])]
    public ?string $speciesName;

    #[Groups(['animal:read'])]
    public ?string $habitatUuid;

    #[Groups(['animal:list'])]
    public ?string $habitatName;


    #[Groups(['animal:read', 'animal:list'])]
    public ?array $pictures = [];

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
        string $speciesUuid,
        ?string $speciesName = null,
        ?string $habitatUuid = null,
        ?string $habitatName = null,
        ?array $pictures = [],
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
        $this->speciesName = $speciesName;
        $this->habitatUuid = $habitatUuid;
        $this->habitatName = $habitatName;
        $this->pictures = $pictures;
    }

    public static function fromEntity(Animal $animal): self
    {
        $animalPictures = $animal->getAnimalPictures();
        $picturesDTOs = [];
        foreach ($animalPictures as $animalPicture) {
            $picturesDTOs[] = PictureReadDTO::fromEntity($animalPicture->getPicture());
        }

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
            $animal->getSpecies()->getUuid(),
            $animal->getSpecies()->getCommonName(),
            $animal->getHabitat() ? $animal->getHabitat()->getUuid() : null,
            $animal->getHabitat() ? $animal->getHabitat()->getName() : null,
            count($picturesDTOs) > 0 ? $picturesDTOs : null
        );
    }
}

?>