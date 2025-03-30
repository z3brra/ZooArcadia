<?php

namespace App\DTO;

use App\Entity\Activity;
use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

class ActivityReadDTO
{
    #[Groups(['activity:read'])]
    public string $uuid;

    #[Groups(['activity:read'])]
    public string $name;

    #[Groups(['activity:read'])]
    public ?string $description;

    #[Groups(['activity:read'])]
    public DateTimeImmutable $createdAt;

    #[Groups(['activity:read'])]
    public ?DateTimeImmutable $updatedAt;

    #[Groups(['activity:with-rates'])]
    public ?array $rates = [];

    public function __construct(
        string $uuid,
        string $name,
        ?string $description = null,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt = null,
        ?array $rates = []
    ) {
        $this->uuid = $uuid;
        $this->name = $name;
        $this->description = $description;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->rates = $rates;
    }

    public static function fromEntity(Activity $activity, bool $withRates): self
    {
        $rates = $activity->getRates();
        $ratesDTOs = [];
        foreach ($rates as $rate) {
            $ratesDTOs[] = RatesReadDTO::fromEntity($rate);
        }

        if ($withRates) {
            $rates = $activity->getRates();
            $ratesDTOs = [];
            foreach ($rates as $rate) {
                $ratesDTOs[] = RatesReadDTO::fromEntity($rate);
            }
            return new self(
                $activity->getUuid(),
                $activity->getName(),
                $activity->getDescription(),
                $activity->getCreatedAt(),
                $activity->getUpdatedAt(),
                count($ratesDTOs) > 0 ? $ratesDTOs : null
            );
        } else {
            return new self(
                $activity->getUuid(),
                $activity->getName(),
                $activity->getDescription(),
                $activity->getCreatedAt(),
                $activity->getUpdatedAt(),
            );
        }
    }
}

?>
