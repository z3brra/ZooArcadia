<?php

namespace App\DTO;

use App\Entity\Activity;
use App\Entity\Rates;

use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

class RatesReadDTO
{
    #[Groups(['rates:read'])]
    public string $uuid;

    #[Groups(['rates:read'])]
    public string $title;

    #[Groups(['rates:read'])]
    public float $price;

    #[Groups(['rates:read'])]
    public DateTimeImmutable $createdAt;

    #[Groups(['rates:read'])]
    public ?DateTimeImmutable $updatedAt;

    #[Groups(['rates:read'])]
    public string $activityUuid;

    public function __construct(
        string $uuid,
        string $title,
        float $price,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt = null,
        string $activityUuid
    ) {
        $this->uuid = $uuid;
        $this->title = $title;
        $this->price = $price;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->activityUuid = $activityUuid;
    }

    public static function fromEntity(Rates $rates): self
    {
        return new self(
            $rates->getUuid(),
            $rates->getTitle(),
            $rates->getPrice(),
            $rates->getCreatedAt(),
            $rates->getUpdatedAt(),
            $rates->getActivity()->getUuid()
        );
    }
}

?>