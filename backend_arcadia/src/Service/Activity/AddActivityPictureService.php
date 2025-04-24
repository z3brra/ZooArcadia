<?php

namespace App\Service\Activity;

use App\Repository\ActivityRepository;
use App\DTO\Picture\PictureDTO;
use App\DTO\Picture\PictureReadDTO;

use App\Service\Picture\CreatePictureService;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AddActivityPictureService
{
    public function __construct(
        private ActivityRepository $activityRepository,

        private CreatePictureService $createPictureService,
    ) {}


    public function addPicture(string $uuid, UploadedFile $file): PictureReadDTO
    {
        $activity = $this->activityRepository->findOneByUuid($uuid);
        if (!$activity) {
            throw new NotFoundHttpException("Activity not found or does not exist");
        }

        $pictureCreateDTO = new PictureDTO();
        $pictureCreateDTO->associatedEntityType = 'activity';
        $pictureCreateDTO->associatedEntityUuid = $uuid;
        $pictureCreateDTO->filename = $file->getClientOriginalName();

        $pictureReadDTO = $this->createPictureService->createPicture($pictureCreateDTO, $file);

        return $pictureReadDTO;
    }
}

?>