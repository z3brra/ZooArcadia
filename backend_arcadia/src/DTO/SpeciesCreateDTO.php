<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class SpeciesCreateDTO
{
    #[Assert\NotBlank(message: "Common name is required.")]
    #[Assert\Length(max: 255, maxMessage: "The common name cannot exceed 255 characters.")]
    public string $commonName;

    #[Assert\NotBlank(message: "Scientific name is required.")]
    #[Assert\Length(max: 255, maxMessage: "The scientific name may not exceed 255 characters.")]
    public string $scientificName;

    #[Assert\NotBlank(message: "Lifespan is required.")]
    #[Assert\Length(max: 255, maxMessage: "Lifespan may not exceed 255 characters.")]
    public string $lifespan;

    #[Assert\NotBlank(message: "Diet is required.")]
    #[Assert\Choice(choices: ["HERBIVOROUS", "CARNIVOROUS", "OMNIVOROUS"], message: "The diet must be herbivorous, carnivorous or omnivorous.")]
    public string $diet;

    #[Assert\NotBlank(message: "Description is required.")]
    #[Assert\Length(min: 10, minMessage: "The description must contain at least 10 characters.")]
    public string $description;
}

?>