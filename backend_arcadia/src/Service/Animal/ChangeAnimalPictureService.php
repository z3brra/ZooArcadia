<?php

namespace App\Service\Animal;

use App\Repository\AnimalRepository;
use App\DTO\Picture\PictureReadDTO;
use App\Service\Picture\UpdatePictureService;

use App\Repository\PictureRepository;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\File\UploadedFile;


class ChangeAnimalPictureService
{
    public function __construct(
        private AnimalRepository $animalRepository,

        private PictureRepository $pictureRepository,

        private UpdatePictureService $updatePictureService,
    ) {}

    public function changePicture(string $uuid, string $pictureUuid, UploadedFile $file): PictureReadDTO
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);
        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }
        $filename = $file->getClientOriginalName();
        $pictureReadDTO = $this->updatePictureService->updatePicture($pictureUuid, $filename, $file);

        return $pictureReadDTO;
    }

}
?>
