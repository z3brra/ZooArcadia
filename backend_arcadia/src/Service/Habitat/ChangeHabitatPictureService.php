<?php

namespace App\Service\Habitat;

use App\Repository\HabitatRepository;
use App\DTO\Picture\PictureReadDTO;
use App\Service\Picture\UpdatePictureService;

use App\Repository\PictureRepository;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ChangeHabitatPictureService
{
    public function __construct(
        private HabitatRepository $habitatRepository,
        private PictureRepository $pictureRepository,
        private UpdatePictureService $updatePictureService
    ) {}

    public function changePicture(string $uuid, string $pictureUuid, UploadedFile $file): PictureReadDTO
    {
        $habitat = $this->habitatRepository->findOneByUuid($uuid);
        if (!$habitat) {
            throw new NotFoundHttpException("Habitat not found or does not exist");
        }
        $filename = $file->getClientOriginalName();
        $pictureReadDTO = $this->updatePictureService->updatePicture($pictureUuid, $filename, $file);

        return $pictureReadDTO;
    }
}

?>