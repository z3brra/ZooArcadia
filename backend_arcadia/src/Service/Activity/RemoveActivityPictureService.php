<?php

namespace App\Service\Activity;

use App\Service\Picture\DeletePictureService;

use App\Repository\ActivityRepository;
use App\Repository\ActivityPictureRepository;
use App\Repository\PictureRepository;

use Symfony\Component\HttpKernel\Exception\{NotFoundHttpException, BadRequestHttpException};

class RemoveActivityPictureService
{
    public function __construct(
        private ActivityRepository $activityRepository,
        private ActivityPictureRepository $activityPictureRepository,
        private PictureRepository $pictureRepository,

        private DeletePictureService $deletePictureService
    ) {}

    public function removePicture(string $uuid, string $pictureUuid): void
    {
        $activity = $this->activityRepository->findOneByUuid($uuid);
        if (!$activity) {
            throw new NotFoundHttpException("Activity not found or does not exist");
        }

        $picture = $this->pictureRepository->findOneByUuid($pictureUuid);
        if (!$picture) {
            throw new NotFoundHttpException("Picture not found or does not exist with UUID : " . $pictureUuid);
        }

        $activityPicture = $this->activityPictureRepository->findOneBy([
            'activity' => $activity,
            'picture' => $picture
        ]);
        if (!$activityPicture) {
            throw new BadRequestHttpException("Picture is not linked to the specified activity");
        }
        $this->deletePictureService->deletePicture($pictureUuid);
    }
}

?>
