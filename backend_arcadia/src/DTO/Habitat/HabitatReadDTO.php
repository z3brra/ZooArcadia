<?php

namespace App\DTO\Habitat;

use App\Entity\Habitat;

use App\DTO\Picture\PictureReadDTO;

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

    #[Groups(['habitat:read'])]
    public ?array $pictures = [];

    public function __construct(
        string $uuid,
        string $name,
        ?string $description = null,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt = null,
        ?int $animalCount = null,
        ?array $pictures = [],
    ) {
        $this->uuid = $uuid;
        $this->name = $name;
        $this->description = $description;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->animalCount = $animalCount;
        $this->pictures = $pictures;
    }

    public static function fromEntity(Habitat $habitat, bool $withAnimalCount = false): self
    {
        $habitatPictures = $habitat->getHabitatPictures();
        $picturesDTOs = [];
        foreach ($habitatPictures as $habitatPicture) {
            $picturesDTOs[] = PictureReadDTO::fromEntity($habitatPicture->getPicture());
        }

        $habitatDTO = new self(
            uuid: $habitat->getUuid(),
            name: $habitat->getName(),
            description: $habitat->getDescription(),
            createdAt: $habitat->getCreatedAt(),
            updatedAt: $habitat->getUpdatedAt(),
            animalCount: null,
            pictures: count($picturesDTOs) > 0 ? $picturesDTOs : null
        );

        if ($withAnimalCount) {
            $habitatDTO->animalCount = count($habitat->getAnimals());
        }

        return $habitatDTO;
    }

}

?>