<?php

namespace App\DTO\Rates;

use Symfony\Component\Validator\Constraints as Assert;

class RatesDTO
{
    #[Assert\NotBlank(message: "Title is required.", groups: ['create'])]
    #[Assert\Length(
        min: 2,
        minMessage: "Title must have at least 2 chars.",
        max: 64,
        maxMessage: "Title may not exceed 64 characters.",
        groups: ['create', 'update']
    )]
    public ?string $title = null;

    #[Assert\NotNull(message: "Price is required.", groups: ['create'])]
    // #[Assert\Positive(message: "Price must be a positive number.", groups: ['create', 'update'])]
    public ?float $price = null;

    #[Assert\NotNull(message: "Activity uuid is required.", groups: ['create'])]
    public ?string $activityUuid = null;

    public function isEmpty(): bool
    {
        return $this->title        === null &&
               $this->price        === null &&
               $this->activityUuid === null;
    }
}

?>