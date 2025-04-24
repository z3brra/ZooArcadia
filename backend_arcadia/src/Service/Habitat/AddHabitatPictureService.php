<?php

namespace App\Service\Habitat;

use App\Repository\HabitatRepository;
use App\DTO\Picture\{PictureDTO, PictureReadDTO};

use App\Service\Picture\CreatePictureService;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AddHabitatPictureService
{
    public function __construct(
        private HabitatRepository $habitatRepository,
        private CreatePictureService $createPictureService
    ) {}

    public function addPicture(string $uuid, UploadedFile $file): PictureReadDTO
    {
        $habitat = $this->habitatRepository->findOneByUuid($uuid);
        if (!$habitat) {
            throw new NotFoundHttpException("Habitat not found or does not exist");
        }

        $pictureCreateDTO = new PictureDTO();
        $pictureCreateDTO->associatedEntityType = 'habitat';
        $pictureCreateDTO->associatedEntityUuid = $uuid;
        $pictureCreateDTO->filename = $file->getClientOriginalName();

        $pictureReadDTO = $this->createPictureService->createPicture($pictureCreateDTO, $file);

        return $pictureReadDTO;
    }
}


?>
