<?php

namespace App\DTO\Activity;

use App\Entity\Activity;

use App\DTO\Rates\RatesReadDTO;
use App\DTO\Picture\PictureReadDTO;

use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Groups;

class ActivityReadDTO
{
    #[Groups(['activity:read', 'activity:list'])]
    public string $uuid;

    #[Groups(['activity:read', 'activity:list'])]
    public string $name;

    #[Groups(['activity:read', 'activity:list'])]
    public ?string $description;

    #[Groups(['activity:read'])]
    public DateTimeImmutable $createdAt;

    #[Groups(['activity:read'])]
    public ?DateTimeImmutable $updatedAt;

    #[Groups(['activity:with-rates'])]
    public ?array $rates = [];

    #[Groups(['activity:read', 'activity:list'])]
    public ?array $pictures = [];

    public function __construct(
        string $uuid,
        string $name,
        ?string $description = null,
        DateTimeImmutable $createdAt,
        ?DateTimeImmutable $updatedAt = null,
        ?array $rates = [],
        ?array $pictures = [],
    ) {
        $this->uuid = $uuid;
        $this->name = $name;
        $this->description = $description;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->rates = $rates;
        $this->pictures = $pictures;
    }

    public static function fromEntity(Activity $activity, bool $withRates): self
    {
        $activityPictures = $activity->getActivityPictures();
        $picturesDTOs = [];
        foreach ($activityPictures as $activityPicture) {
            $picturesDTOs[] = PictureReadDTO::fromEntity($activityPicture->getPicture());
        }

        $activityDTO = new self(
            uuid: $activity->getUuid(),
            name: $activity->getName(),
            description: $activity->getDescription(),
            createdAt: $activity->getCreatedAt(),
            updatedAt: $activity->getUpdatedAt(),
            rates: null,
            pictures: count($picturesDTOs) > 0 ? $picturesDTOs : null
        );

        if ($withRates) {
            $rates = $activity->getRates();
            $ratesDTOs = [];
            foreach ($rates as $rate) {
                $ratesDTOs[] = RatesReadDTO::fromEntity($rate);
            }
            $activityDTO->rates = count($ratesDTOs) > 0 ? $ratesDTOs : null;
        }

        return $activityDTO;
    }
}

?>
