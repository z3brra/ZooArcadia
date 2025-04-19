<?php

namespace App\Service\Picture;

use App\Service\Picture\{PictureFileManager, SlugGenerator};
use App\Service\ValidationService;

use App\Entity\{Picture, Animal, Habitat, Activity};
use App\Entity\{AnimalPicture};

use App\Repository\{PictureRepository, AnimalRepository, HabitatRepository, ActivityRepository};

use App\DTO\Picture\{PictureDTO, PictureReadDTO};

use Doctrine\ORM\EntityManagerInterface;

use DateTimeImmutable;
use Exception;
use RuntimeException;
use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

use Symfony\Component\HttpFoundation\File\UploadedFile;

class CreatePictureService
{
    public function __construct(
        private EntityManagerInterface $entityManager,

        private AnimalRepository $animalRepository,

        private ValidationService $validationService,
        private PictureFileManager $pictureFileManager,
        private SlugGenerator $slugGenerator
    ) {}

    public function createPicture(PictureDTO $pictureCreateDTO, UploadedFile $file): PictureReadDTO
    {
        $this->validationService->validate($pictureCreateDTO, ['create']);

        switch ($pictureCreateDTO->associatedEntityType) {
            case 'animal':
                $entity = $this->animalRepository->findOneByUuid($pictureCreateDTO->associatedEntityUuid);
                if (!$entity) {
                    throw new NotFoundHttpException("Animal not found with UUID : " . $pictureCreateDTO->associatedEntityUuid);
                }
                break;

            default:
                throw new BadRequestHttpException("Invalid associated entity type");
        }

        $slug = $this->slugGenerator->generate($pictureCreateDTO->filename);

        $extension = pathinfo($pictureCreateDTO->filename, PATHINFO_EXTENSION);

        $filename = $slug . '.' . $extension;

        try {
            $relativePath = $this->pictureFileManager->save($filename, $file);
        } catch (Exception $e) {
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

}

?>
