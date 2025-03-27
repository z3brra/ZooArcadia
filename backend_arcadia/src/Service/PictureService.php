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
use DateTime;
use DateTimeImmutable;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\component\HttpKernel\Exception\NotFoundHttpException;

class PictureService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private PictureRepository $pictureRepository,
        private AnimalRepository $animalRepository,

        private ValidatorInterface $validator
    ) {}

    public function createPicture(PictureDTO $pictureCreateDTO): PictureReadDTO
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

        $picture = new Picture();
        $picture->setSlug($this->generateSlugFromFilename($pictureCreateDTO->filename));

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

    // public function updatePicture(PictureDTO $pictureCreateDTO): PictureReadDTO
    // {
    //     $errors = $this->validator->validate($pictureCreateDTO, null, ['update']);
    //     if (count($errors) > 0) {
    //         $validationErrors = [];
    //         foreach ($errors as $error) {
    //             $validationErrors[] = $error->getMessage();
    //         }
    //         throw new ValidationException($validationErrors);
    //     }

    //     switch ($pictureCreateDTO->associatedEntityType) {
    //         case 'animal':
    //             $entity = $this->animalRepository->findOneByUuid($pictureCreateDTO->associatedEntityUuid);
    //             if (!$entity) {
    //                 throw new NotFoundHttpException("Animal not found with UUID : " . $pictureCreateDTO->associatedEntityUuid);
    //             }
    //             break;
    //         default:
    //         throw new BadRequestHttpException("Invalid associated entity type");
    //             break;
    //     }

    // }

    private function generateSlugFromFilename(string $filename): string
    {
        $slug = StringHelper::slugify(pathinfo($filename, PATHINFO_FILENAME));

        return substr($slug, -255, strlen($slug));
    }
}


?>