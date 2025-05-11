<?php

namespace App\DTO\HabitatReport;

use Symfony\Component\Validator\Constraints as assert;

class HabitatReportDTO
{
    #[Assert\NotBlank(message: "Habitat uuid is required.", groups: ['create'])]
    public ?string $habitatUuid = null;

    // #[Assert\NotBlank(message: "User uuid is required.", groups: ['create'])]
    // public ?string $createdByUuid = null;

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

    public function isEmpty(): bool
    {
        return $this->habitatUuid   === null &&
            //    $this->createdByUuid === null &&
               $this->state         === null &&
               $this->comment       === null;
    }

}

?>
