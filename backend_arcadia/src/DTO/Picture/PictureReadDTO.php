<?php

namespace App\DTO\Picture;

use App\Entity\Picture;
use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

class PictureReadDTO
{
    #[Groups(['picture:read', 'entity-with-picture: read'])]
    public string $uuid;

    #[Groups(['picture:read', 'entity-with-picture: read'])]
    public string $slug;

    #[Groups(['picture:read', 'entity-with-picture: read'])]
    public string $path;

    #[Groups(['picture:read'])]
    public string $associatedEntityType;

    #[Groups(['picture:read'])]
    public string $associatedEntityUuid;

    #[Groups(['picture:read', 'entity-with-picture: read'])]
    public DateTimeImmutable $createdAt;

    #[Groups(['picture:read', 'entity-with-picture: read'])]
    public ?DateTimeImmutable $updatedAt;

    public function __construct(
        string $uuid,
        string $slug,
        string $path,
        string $associatedEntityType,
        string $associatedEntityUuid,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt = null
    ) {
        $this->uuid = $uuid;
        $this->slug = $slug;
        $this->path = $path;
        $this->associatedEntityType = $associatedEntityType;
        $this->associatedEntityUuid = $associatedEntityUuid;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
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
            path: $picture->getPath(),
            associatedEntityType: $entityType,
            associatedEntityUuid: $entityUuid,
            createdAt: $picture->getCreatedAt(),
            updatedAt: $picture->getUpdatedAt()
        );
    }
}

?>