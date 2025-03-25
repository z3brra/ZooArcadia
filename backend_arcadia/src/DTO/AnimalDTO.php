<?php

namespace App\DTO;

use DateTimeInterface;
use Symfony\Component\Validator\Constraints as Assert;

class AnimalDTO
{
    #[Assert\NotBlank(message: "Name is required.", groups: ['create'])]
    #[Assert\Length(
        min: 2,
        minMessage: "Name must have at least 2 chars.",
        max: 36,
        maxMessage: "Name may not exceed 36 characters.",
        groups: ['create']
    )]
    public ?string $name = null;
    
    #[Assert\NotNull(message: "Is male is required.", groups: ['create'])]
    public ?bool $isMale = null;
    
    #[Assert\NotNull(message: "Size is required.", groups: ['create'])]
    #[Assert\Positive(message: "Size must be a positive number.", groups: ['create'])]
    public ?int $size = null;
    
    #[Assert\NotNull(message: "Weight is required.", groups: ['create'])]
    #[Assert\Positive(message: "Weight must be a positive number.", groups: ['create'])]
    public ?int $weight = null;
    
    #[Assert\NotNull(message: "Is fertile is required.", groups: ['create'])]
    public ?bool $isFertile = null;
    
    #[Assert\NotNull(message: "Birth date is required.", groups: ['create'])]
    #[Assert\Type(DateTimeInterface::class, message: "Birth date must be a valid date.", groups: ['create'])]
    public ?DateTimeInterface $birthDate = null;
    
    #[Assert\NotNull(message: "Arrival date is required.", groups: ['create'])]
    #[Assert\Type(DateTimeInterface::class, message: "Birth date must be a valid date.", groups: ['create'])]
    #[Assert\LessThanOrEqual("today", message: "Birth date cannot be in the future.", groups: ['create'])]
    public ?DateTimeInterface $arrivalDate = null;
    
    #[Assert\NotBlank(message: "Species uuid is required.", groups: ['create'])]
    public ?string $speciesUuid = null;

    public ?string $habitatUuid = null;

    public function isEmpty(): bool
    {
        return $this->name        === null &&
               $this->isMale      === null &&
               $this->size        === null &&
               $this->weight      === null &&
               $this->isFertile   === null &&
               $this->birthDate   === null &&
               $this->arrivalDate === null &&
               $this->speciesUuid === null &&
               $this->habitatUuid === null;
    }
}

?>