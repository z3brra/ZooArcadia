<?php

namespace App\DTO;

use App\Entity\Picture;
use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

class PictureReadDTO
{
    #[Groups(['picture:read'])]
    public string $uuid;

    #[Groups(['picture:read'])]
    public string $slug;

    #[Groups(['picture:read'])]
    public string $associatedEntityType;

    #[Groups(['picture:read'])]
    public string $associatedEntityUuid;

    #[Groups(['picture:read'])]
    public DateTimeImmutable $createdAt;

    public function __construct(
        string $uuid,
        string $slug,
        string $associatedEntityType,
        string $associatedEntityUuid,
        DateTimeImmutable $createdAt
    ) {
        $this->uuid = $uuid;
        $this->slug = $slug;
        $this->associatedEntityType = $associatedEntityType;
        $this->associatedEntityUuid = $associatedEntityUuid;
        $this->createdAt = $createdAt;
    }

    public static function fromEntity(Picture $picture): self
    {
        $associatedEntity = $picture->getAnimalPictures()->first();
        if ($associatedEntity) {
            $entityType = 'animal';
            $entityUuid = $associatedEntity->getAnimal()->getUuid();
        }

        /*
        $associatedEntity = $picture->getHabitatPictures()->first();
        if ($associatedEntity) {
            $entityType = 'habitat';
            $entityUuid = $associatedEntity->getHabitat()->getUuid();
        }
        */

        return new self(
            uuid: $picture->getUuid(),
            slug: $picture->getSlug(),
            associatedEntityType: $entityType,
            associatedEntityUuid: $entityUuid,
            createdAt: $picture->getCreatedAt()
        );
    }
}

?>