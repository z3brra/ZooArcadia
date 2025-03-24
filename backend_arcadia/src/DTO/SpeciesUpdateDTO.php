<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class SpeciesUpdateDTO
{
    #[Assert\Type('string')]
    #[Assert\Length(min: 2, minMessage: "Common name must have at least 2 chars.", max: 255, maxMessage: "Lifespan may not exceed 255 characters.")]
    public ?string $commonName = null;

    #[Assert\Type('string')]
    #[Assert\Length(min: 2, minMessage: "Scientific name must have at least 2 chars.", max: 255, maxMessage: "Lifespan may not exceed 255 characters.")]
    public ?string $scientificName = null;

    #[Assert\Type('string')]
    #[Assert\Length(min:2, minMessage: "Lifespan must have at least 2 chars.", max: 255, maxMessage: "Lifespan may not exceed 255 characters.")]
    public ?string $lifespan = null;

    #[Assert\Type('string')]
    #[Assert\Choice(choices: ["HERBIVOROUS", "CARNIVOROUS", "OMNIVOROUS"], message: "The diet must be herbivorous, carnivorous or omnivorous.")]
    public ?string $diet = null;

    #[Assert\Type('string')]
    #[Assert\Length(min: 10, minMessage: "The description must contain at least 10 characters.")]
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