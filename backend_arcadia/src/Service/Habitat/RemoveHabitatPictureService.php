<?php

namespace App\Service\Habitat;

use App\Service\Picture\DeletePictureService;

use App\Repository\HabitatRepository;
use App\Repository\HabitatPictureRepository;
use App\Repository\PictureRepository;

use Symfony\Component\HttpKernel\Exception\{NotFoundHttpException, BadRequestHttpException};

class RemoveHabitatPictureService
{
    public function __construct(
        private HabitatRepository $habitatRepository,
        private HabitatPictureRepository $habitatPictureRepository,
        private PictureRepository $pictureRepository,
        private DeletePictureService $deletePictureService
    ) {}

    public function removePicture(string $uuid, string $pictureUuid): void
    {
        $habitat = $this->habitatRepository->findOneByUuid($uuid);
        if (!$habitat) {
            throw new NotFoundHttpException("Habitat not foud or does not exist");
        }

        $picture = $this->pictureRepository->findOneByUuid($pictureUuid);
        if (!$picture) {
            throw new NotFoundHttpException("Picture not found or does not exist with UUID : " . $pictureUuid);
        }

        $habitatPicture = $this->habitatPictureRepository->findOneBy([
            'habitat' => $habitat,
            'picture' => $picture
        ]);
        if (!$habitatPicture) {
            throw new BadRequestHttpException("Picture is not linked to the specified habitat");
        }

        $this->deletePictureService->deletePicture($pictureUuid);
    }
}

?>
