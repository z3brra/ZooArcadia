<?php

namespace App\DTO\Species;

use Symfony\Component\Validator\Constraints as Assert;

class SpeciesDTO
{
    #[Assert\NotBlank(message: "Common name is required.", groups: ['create'])]
    #[Assert\Length(
        min: 2,
        minMessage: "Common name must have at least 2 chars.",
        max: 255,
        maxMessage: "The common may not exceed 255 characters.",
        groups: ['create', 'update']
    )]
    public ?string $commonName = null;

    #[Assert\NotBlank(message: "Scientific name is required.", groups: ['create'])]
    #[Assert\Length(
        min: 2,
        minMessage: "Scientific name must have at least 2 chars.",
        max: 255,
        maxMessage: "The scientific name may not exceed 255 characters.",
        groups: ['create', 'update']
    )]
    public ?string $scientificName = null;

    #[Assert\NotBlank(message: "Lifespan is required.", groups: ['create'])]
    #[Assert\Length(
        min:2,
        minMessage: "Lifespan must have at least 2 chars.",
        max: 255,
        maxMessage: "Lifespan may not exceed 255 characters.",
        groups: ['create', 'update']
    )]
    public ?string $lifespan = null;

    #[Assert\NotBlank(message: "Diet is required.", groups: ['create'])]
    #[Assert\Choice(
        choices: ["HERBIVOROUS", "CARNIVOROUS", "OMNIVOROUS"],
        message: "The diet must be herbivorous, carnivorous or omnivorous.",
        groups: ['create', 'update']
    )]
    public ?string $diet = null;

    #[Assert\NotBlank(message: "Description is required.", groups: ['create'])]
    #[Assert\Length(
        min: 10,
        minMessage: "The description must contain at least 10 characters.",
        groups: ['create', 'update']
    )]
    public ?string $description = null;

    public function isEmpty(): bool
    {
        return $this->commonName     === null &&
               $this->scientificName === null &&
               $this->lifespan       === null &&
               $this->diet           === null &&
               $this->description    === null;
    }
}

?>