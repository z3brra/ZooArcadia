<?php

namespace App\Service\Picture;

use App\Service\Picture\PictureFileManager;

use App\Repository\PictureRepository;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DeletePictureService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private PictureRepository $pictureRepository,

        private PictureFileManager $pictureFileManager
    ) {}

    public function deletePicture(string $uuid): void
    {
        $picture = $this->pictureRepository->findOneByUuid($uuid);
        if (!$picture) {
            throw new NotFoundHttpException("Picture not found or does not exist");
        }

        $relativePath = $picture->getPath();
        if (!$this->pictureFileManager->delete($relativePath)) {
            throw new NotFoundHttpException("File picture not found or does not exist");
        }

        $this->entityManager->remove($picture);
        $this->entityManager->flush();
    }
}


?>
