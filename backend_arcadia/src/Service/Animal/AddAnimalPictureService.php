<?php

namespace App\Service\Animal;

use App\Repository\AnimalRepository;
use App\DTO\Picture\PictureDTO;
use App\DTO\Picture\PictureReadDTO;

use App\Service\Picture\CreatePictureService;


use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AddAnimalPictureService
{
    public function __construct(
        private AnimalRepository $animalRepository,

        private CreatePictureService $createPictureService,
    ) {}


    public function addPicture(string $uuid, UploadedFile $file): PictureReadDTO
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);
        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }

        $pictureCreateDTO = new PictureDTO();
        $pictureCreateDTO->associatedEntityType = 'animal';
        $pictureCreateDTO->associatedEntityUuid = $uuid;
        $pictureCreateDTO->filename = $file->getClientOriginalName();

        $pictureReadDTO = $this->createPictureService->createPicture($pictureCreateDTO, $file);

        return $pictureReadDTO;
    }
}

?>
