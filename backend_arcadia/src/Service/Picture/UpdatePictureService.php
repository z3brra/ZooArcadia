<?php

namespace App\Service\Picture;

use App\Service\Picture\{PictureFileManager, SlugGenerator};

use App\Repository\PictureRepository;

use App\DTO\Picture\PictureReadDTO;

use Doctrine\ORM\EntityManagerInterface;

use DateTimeImmutable;

use RuntimeException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class UpdatePictureService
{
    private string $publicDir;

    public function __construct(
        private EntityManagerInterface $entityManager,

        private PictureRepository $pictureRepository,

        private PictureFileManager $pictureFileManager,
        private SlugGenerator $slugGenerator,

        private ParameterBagInterface $params
    ) {
        $this->publicDir = $params->get('public_directory');
    }

    public function updatePicture(string $uuid, string $filename, UploadedFile $file): PictureReadDTO
    {
        $picture = $this->pictureRepository->findOneByUuid($uuid);
        if (!$picture) {
            throw new NotFoundHttpException("Picture not found or does not exist");
        }

        $oldFilePath = $this->publicDir . $picture->getPath();
        if (is_file($oldFilePath)) {
            unlink($oldFilePath);
        } else {
            throw new NotFoundHttpException("File picture not found or does not exist");
        }

        $slug = $this->slugGenerator->generate($filename);
        $extension = pathinfo($filename);
        $updatedFilename = $slug . '.' . $extension;

        try {
            $relativePath = $this->pictureFileManager->save($updatedFilename, $file);
        } catch (RuntimeException $e) {
            throw new RuntimeException($e->getMessage());
        }

        $picture->setSlug($slug);
        $picture->setPath($relativePath);
        $picture->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->flush();

        return PictureReadDTO::fromEntity($picture);
    }

}

?>