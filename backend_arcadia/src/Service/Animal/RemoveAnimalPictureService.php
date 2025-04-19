<?php

namespace App\Service\Animal;

use App\Service\Picture\DeletePictureService;

use App\Repository\AnimalRepository;
use App\Repository\AnimalPictureRepository;
use App\Repository\PictureRepository;

use Symfony\Component\HttpKernel\Exception\{NotFoundHttpException, BadRequestHttpException};

class RemoveAnimalPictureService
{
    public function __construct(
        private AnimalRepository $animalRepository,
        private AnimalPictureRepository $animalPictureRepository,
        private PictureRepository $pictureRepository,

        private DeletePictureService $deletePictureService
    ) {}

    public function removePicture(string $uuid, string $pictureUuid): void
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);
        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }

        $picture = $this->pictureRepository->findOneByUuid($pictureUuid);
        if (!$picture) {
            throw new NotFoundHttpException("Picture not found or does not exist with UUID : " . $pictureUuid);
        }

        $animalPicture = $this->animalPictureRepository->findOneBy([
            'animal' => $animal,
            'picture' => $picture
        ]);
        if (!$animalPicture) {
            throw new BadRequestHttpException("Picture is not linked to the specified animal");
        }
        $this->deletePictureService->deletePicture($pictureUuid);
    }
}

?>
