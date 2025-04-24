<?php

namespace App\Service\Activity;

use App\Repository\ActivityRepository;
use App\DTO\Picture\PictureReadDTO;
use App\Service\Picture\UpdatePictureService;

use App\Repository\PictureRepository;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\File\UploadedFile;


class ChangeActivityPictureService
{
    public function __construct(
        private ActivityRepository $activityRepository,

        private PictureRepository $pictureRepository,

        private UpdatePictureService $updatePictureService,
    ) {}

    public function changePicture(string $uuid, string $pictureUuid, UploadedFile $file): PictureReadDTO
    {
        $activity = $this->activityRepository->findOneByUuid($uuid);
        if (!$activity) {
            throw new NotFoundHttpException("Activity not found or does not exist");
        }
        $filename = $file->getClientOriginalName();
        $pictureReadDTO = $this->updatePictureService->updatePicture($pictureUuid, $filename, $file);

        return $pictureReadDTO;
    }

}
?>
