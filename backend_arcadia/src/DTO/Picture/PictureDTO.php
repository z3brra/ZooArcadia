<?php

namespace App\DTO\Picture;

use Symfony\Component\Validator\Constraints as Assert;

class PictureDTO
{
    #[Assert\NotBlank(message: "Filename is required.", groups: ['create', 'update'])]
    #[Assert\Length(
        min: 2,
        minMessage: "Filename must have at least 2 characters.",
        max: 255,
        maxMessage: "Filename may not exceed 255 characters.",
        groups: ['create', 'update']
    )]
    public ?string $filename = null;

    #[Assert\NotBlank(message: "Entity type is required", groups: ['create', 'update'])]
    #[Assert\Choice(
        choices: ['animal', 'habitat', 'activity'],
        message: "The entity type must be animal, habitat or activity",
        groups: ['create', 'update']
    )]
    public ?string $associatedEntityType = null;

    #[Assert\NotBlank(message: "Entity uuid is required.", groups: ['create', 'update'])]
    public ?string $associatedEntityUuid = null;

    public function isEmpty(): bool
    {
        return $this->filename             === null &&
               $this->associatedEntityType === null &&
               $this->associatedEntityUuid === null;
    }
}

?>
