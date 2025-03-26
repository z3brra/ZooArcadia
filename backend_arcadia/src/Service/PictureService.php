<?php

namespace App\Service;

use App\Entity\Picture;
use App\Entity\Animal;
use App\Entity\AnimalPicture;

use App\Repository\PictureRepository;
use App\Repository\AnimalRepository;

use App\DTO\PictureDTO;
use App\DTO\PictureReadDTO;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

use App\Exception\ValidationException;
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

    public function createPicture(PictureDTO $pictureCreateDTO): Picture
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

        return $picture;
    }

    private function generateSlugFromFilename(string $filename): string
    {
        return strtolower(preg_replace('/[^a-z0-9]+/', '-', pathinfo($filename, PATHINFO_FILENAME)));
    }
}


?>