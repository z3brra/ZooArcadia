<?php

namespace App\DTO\Habitat;

use Symfony\Component\Validator\Constraints as Assert;

class HabitatDTO
{
    #[Assert\NotBlank(message: "Name is required.", groups: ['create'])]
    #[Assert\Length(
        min: 2,
        minMessage: "Name must have at least 2 chars.",
        max: 36,
        maxMessage: "Name may not exceed 36 characters.",
        groups: ['create', 'update']
    )]
    public ?string $name = null;

    #[Assert\Length(
        min: 10,
        minMessage: "The description must contain at least 10 characters.",
        groups: ['create', 'update']
    )]
    public ?string $description = null;

    public function isEmpty() : bool
    {
        return $this->name        === null &&
               $this->description === null;
    }

}

?>