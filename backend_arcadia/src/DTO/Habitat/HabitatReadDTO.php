<?php

namespace App\DTO\Habitat;

use App\Entity\Habitat;

use App\DTO\Picture\PictureReadDTO;

use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

class HabitatReadDTO
{
    #[Groups(['habitat:read', 'habitat:list', 'habitat:all'])]
    public string $uuid;

    #[Groups(['habitat:read', 'habitat:list', 'habitat:all'])]
    public string $name;

    #[Groups(['habitat:read', 'habitat:list'])]
    public ?string $description;

    #[Groups(['habitat:read'])]
    public ?string $lastState;

    #[Groups(['habitat:read'])]
    public DateTimeImmutable $createdAt;

    #[Groups(['habitat:read'])]
    public ?DateTimeImmutable $updatedAt;

    #[Groups(['habitat:list', 'habitat:with-animalCount'])]
    public ?int $animalCount;

    #[Groups(['habitat:read', 'habitat:list'])]
    public ?array $pictures = [];

    public function __construct(
        string $uuid,
        string $name,
        ?string $description = null,
        ?string $lastState = null,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt = null,
        ?int $animalCount = null,
        ?array $pictures = [],
    ) {
        $this->uuid = $uuid;
        $this->name = $name;
        $this->description = $description;
        $this->lastState = $lastState;
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
            lastState: $habitat->getLastState(),
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