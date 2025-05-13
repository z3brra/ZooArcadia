<?php

namespace App\DTO\AnimalReport;

use Symfony\Component\Validator\Constraints as assert;

class AnimalReportDTO
{
    #[Assert\NotBlank(message: "Animal uuid is required.", groups: ['create'])]
    public ?string $animalUuid = null;

    #[Assert\NotBlank(message: "State is required.", groups: ['create'])]
    #[Assert\Choice(
        choices: ["GOOD", "MEDIUM", "BAD"],
        message: "The state must be good, medium or bad.",
        groups: ['create', 'update']
    )]
    public ?string $state = null;


    #[Assert\Length(
        min: 10,
        minMessage: "The comment must contain at least 10 characters.",
        groups: ['create', 'update']
    )]
    public ?string $comment = null;

    #[Assert\NotBlank(message: "Recommanded food is required", groups: ['create'])]
    #[Assert\Type('array', groups: ['create', 'update'])]
    #[Assert\All(
        constraints: [
            new Assert\Collection([
                'fields' => [
                    'name' => [
                        new Assert\NotBlank(message: "Food item name is required.", groups: ['create', 'update']),
                        new Assert\Type('string', groups: ['create', 'update'])
                    ],
                    'quantity' => [
                        new Assert\NotNull(message: "Fodd item quantity is required.", groups: ['create', 'update']),
                        new Assert\Type('integer', groups: ['create', 'update']),
                        new Assert\Positive(message: "Food item quantity must be positive.", groups: ['create', 'update'])
                    ]
                ],
                'allowExtraFields' => false,
                'allowMissingFields' => false,
                'missingFieldsMessage' => "Food item {{ field }} is required.",
                'groups'=> ['create', 'update']
            ])
        ],
        groups: ['create', 'update']
    )]
    public ?array $recommandedFood = [];

    public function isEmpty(): bool
    {
        return $this->animalUuid      === null &&
               $this->state           === null &&
               $this->comment         === null &&
               $this->recommandedFood === null;
    }
}

?>