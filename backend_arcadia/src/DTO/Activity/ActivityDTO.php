<?php

namespace App\DTO\Activity;

use Symfony\Component\Validator\Constraints as Assert;

class ActivityDTO
{
    #[Assert\NotBlank(message: "Name is required.", groups: ['create'])]
    #[Assert\Length(
        min: 2,
        minMessage: "Name must have at least 2 chars.",
        max: 36,
        maxMessage: "Name may not exceed 64 chars.",
        groups: ['create', 'update']
    )]
    public ?string $name = null;

    #[Assert\Length(
        min: 10,
        minMessage: "Description must have at least 10 chars.",
        groups: ['create', 'update']
    )]
    public ?string $description = null;

    public function isEmpty(): bool
    {
        return $this->name        === null &&
               $this->description === null;
    }
}


?>

