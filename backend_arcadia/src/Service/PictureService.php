<?php

namespace App\Service;

use App\Service\StringHelper;

use App\Entity\Picture;
use App\Entity\Animal;
use App\Entity\AnimalPicture;

use App\Repository\PictureRepository;
use App\Repository\AnimalRepository;

use App\DTO\PictureDTO;
use App\DTO\PictureReadDTO;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

use App\Exception\ValidationException;
use DateTimeImmutable;
use Exception;
use PhpParser\ErrorHandler\Throwing;
use RuntimeException;
use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;


class PictureService
{
    private string $publicDir;
    private string $uploadRelativeDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private PictureRepository $pictureRepository,
        private AnimalRepository $animalRepository,
        private ValidatorInterface $validator,
        private ParameterBagInterface $params
    ) {
        $this->publicDir = $params->get('public_directory');
        $this->uploadRelativeDir =$params->get('upload_relative_directory');
    }

    public function createPicture(PictureDTO $pictureCreateDTO, UploadedFile $file): PictureReadDTO
    {
        $errors = $this->validator->validate($pictureCreateDTO, null, ['create']);
        if (count($errors) > 0) {
            $validationErrors = [];
            foreach ($errors as $error) {
                $validationErrors[] = $error->getMessage();
            }
            throw new ValidationException($validationErrors);
        }

        switch ($pictureCreateDTO->associatedEntityType) {
            case 'animal':
                $entity = $this->animalRepository->findOneByUuid($pictureCreateDTO->associatedEntityUuid);
                if (!$entity) {
                    throw new NotFoundHttpException("Animal not found with UUID : " . $pictureCreateDTO->associatedEntityUuid);
                }
                break;

            default:
                throw new BadRequestHttpException("Invalid associated entity type");
                break;
        }

        $slug = $this->generateSlugFromFilename($pictureCreateDTO->filename);

        $extension = pathinfo($pictureCreateDTO->filename, PATHINFO_EXTENSION);

        $filename = $slug . '.' . $extension;

        try {
            $relativePath = $this->savePicture($filename, $file);
        }  catch (RuntimeException $e) {
            throw new RuntimeException($e->getMessage());
        }

        $picture = new Picture();
        $picture->setSlug($slug);
        $picture->setPath($relativePath);

        if ($entity instanceof Animal) {
            $animalPicture = new AnimalPicture();
            $animalPicture->setAnimal($entity);
            $animalPicture->setPicture($picture);
            $picture->addAnimalPicture($animalPicture);
        }

        $picture->setCreatedAt(new DateTimeImmutable());

        $this->entityManager->persist($picture);
        $this->entityManager->flush();

        return PictureReadDTO::fromEntity($picture);
    }

    public function updatePicture(string $uuid, string $filename, UploadedFile $file): PictureReadDTO
    {
        $picture = $this->pictureRepository->findOneByUuid($uuid);
        if (!$picture) {
            throw new NotFoundHttpException("Picture not found or does not exist");
        }

        // Delete old file with public dir concat (path in database : /uploads/<filename>.<ext>)
        $oldFilePath = $this->publicDir . $picture->getPath();
        if (file_exists($oldFilePath)) {
            unlink($oldFilePath);
        } else {
            throw new NotFoundHttpException("File picture not found or does not exist");
        }

        $slug = $this->generateSlugFromFilename($filename);
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $updatedFilename = $slug . '.' . $extension;

        try {
            $relativePath = $this->savePicture($updatedFilename, $file);
        } catch (RuntimeException $e) {
            throw new RuntimeException($e->getMessage());
        }

        $picture->setSlug($slug);
        $picture->setPath($relativePath);
        $picture->setUpdatedAt(new DateTimeImmutable());

        return PictureReadDTO::fromEntity($picture);
    }

    public function deletePicture(string $uuid): void
    {
        $picture = $this->pictureRepository->findOneByUuid($uuid);
        if (!$picture) {
            throw new NotFoundHttpException("Picture not found or does not exist");
        }

        $filepath = $this->publicDir . $picture->getPath();
        if (file_exists($filepath)) {
            unlink($filepath);
        } else {
            throw new NotFoundHttpException("File picture not found or does not exist");
        }

        $this->entityManager->remove($picture);
        $this->entityManager->flush();
    }

    private function savePicture(string $filename, UploadedFile $file): string
    {
        $uploadDir = $this->publicDir . $this->uploadRelativeDir;
        if (!$uploadDir) {
            throw new RuntimeException("The upload directroy is not defined");
        }

        $relativePath = $this->uploadRelativeDir . $filename;

        try {
            $file->move($uploadDir, $filename);
        } catch (Exception $e) {
            throw new RuntimeException("File upload failed : " . $e->getMessage());
        }

        return $relativePath;
    }

    private function generateSlugFromFilename(string $filename): string
    {
        $slug = StringHelper::slugify(pathinfo($filename, PATHINFO_FILENAME));

        return substr($slug, -255, strlen($slug));
    }
}


?>