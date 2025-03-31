<?php

namespace App\Service;

use App\Entity\Animal;
use App\Repository\AnimalRepository;
use App\DTO\AnimalDTO;
use App\DTO\AnimalReadDTO;
use App\DTO\PictureDTO;
use App\DTO\PictureReadDTO;
use App\Repository\SpeciesRepository;
use App\Service\PictureService;

use App\Repository\AnimalPictureRepository;
use App\Repository\HabitatRepository;
use App\Repository\PictureRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;


use Symfony\Component\HttpKernel\Exception\{NotFoundHttpException, BadRequestHttpException};
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AnimalService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AnimalRepository $animalRepository,

        private SpeciesRepository $speciesRepository,
        private HabitatRepository $habitatRepository,
        private AnimalPictureRepository $animalPictureRepository,
        private PictureRepository $pictureRepository,


        private PictureService $pictureService,

        private ValidationService $validationService
    ) {}

    public function createAnimal(AnimalDTO $animalCreateDTO): AnimalReadDTO
    {
        $this->validationService->validate($animalCreateDTO, ['create']);

        $species = $this->speciesRepository->findOneByUuid($animalCreateDTO->speciesUuid);
        if (!$species) {
            throw new NotFoundHttpException("Species not found with UUID : " . $animalCreateDTO->speciesUuid);
        }

        if ($animalCreateDTO->habitatUuid !== null) {
            $habitat = $this->habitatRepository->findOneByUuid($animalCreateDTO->habitatUuid);
            if (!$habitat) {
                throw new NotFoundHttpException("Habitat not found with UUID : " . $animalCreateDTO->habitatUuid);
            }
        } else {
            $habitat = $animalCreateDTO->habitatUuid;
        }

        $animal = new Animal();
        $animal->setName($animalCreateDTO->name);
        $animal->setIsMale($animalCreateDTO->isMale);
        $animal->setSize($animalCreateDTO->size);
        $animal->setWeight($animalCreateDTO->weight);
        $animal->setIsFertile($animalCreateDTO->isFertile);
        $animal->setBirthDate($animalCreateDTO->birthDate);
        $animal->setArrivalDate($animalCreateDTO->arrivalDate);
        $animal->setSpecies($species);
        $animal->setHabitat($habitat);

        $animal->setCreatedAt(new DateTimeImmutable());

        $this->entityManager->persist($animal);
        $this->entityManager->flush();

        return AnimalReadDTO::fromEntity($animal);
    }

    public function showAnimal(string $uuid): AnimalReadDTO
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);

        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }

        return AnimalReadDTO::fromEntity($animal);
    }

    public function updateAnimal(string $uuid, AnimalDTO $animalUpdateDTO): AnimalReadDTO
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);
        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }

        if ($animalUpdateDTO->isEmpty()) {
            throw new BadRequestHttpException("No data to update");
        }

        $this->validationService->validate($animalUpdateDTO, ['update']);

        $name = $animalUpdateDTO->name;
        $isMale = $animalUpdateDTO->isMale;
        $size = $animalUpdateDTO->size;
        $weight = $animalUpdateDTO->weight;
        $isFertile = $animalUpdateDTO->isFertile;
        $birthDate = $animalUpdateDTO->birthDate;
        $arrivalDate = $animalUpdateDTO->arrivalDate;
        $speciesUuid = $animalUpdateDTO->speciesUuid;

        if ($speciesUuid !== null) {
            $species = $this->speciesRepository->findOneByUuid($speciesUuid);
            if (!$species) {
                throw new NotFoundHttpException("Species not found with UUID : " . $speciesUuid);
            }
            $animal->setSpecies($species);
        }

        if ($name !== null) {
            $animal->setName($name);
        }
        if ($isMale !== null) {
            $animal->setIsMale($isMale);
        }
        if ($size !== null) {
            $animal->setSize($size);
        }
        if ($weight !== null) {
            $animal->setWeight($weight);
        }
        if ($isFertile !== null) {
            $animal->setIsFertile($isFertile);
        }
        if ($birthDate !== null) {
            $animal->setBirthDate($birthDate);
        }
        if ($arrivalDate !== null) {
            $animal->setArrivalDate($arrivalDate);
        }
        
        $animal->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->flush();

        return AnimalReadDTO::fromEntity($animal);
    }

    public function deleteAnimal(string $uuid): void
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);
        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }

        $this->entityManager->remove($animal);
        $this->entityManager->flush();
    }

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

        $pictureReadDTO = $this->pictureService->createPicture($pictureCreateDTO, $file);

        return $pictureReadDTO;
    }

    public function changePicture(string $uuid, string $pictureUuid, UploadedFile $file): PictureReadDTO
    {
        $animal = $this->animalRepository->findOneByUuid($uuid);
        if (!$animal) {
            throw new NotFoundHttpException("Animal not found or does not exist");
        }
        $filename = $file->getClientOriginalName();
        $pictureReadDTO = $this->pictureService->updatePicture($pictureUuid, $filename, $file);

        return $pictureReadDTO;
    }

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
        $this->pictureService->deletePicture($pictureUuid);
    }

    public function listAnimalPaginated(int $page, int $limit): array
    {
        $result = $this->animalRepository->findPaginated($page, $limit);

        $animalDTOs = [];
        foreach ($result['data'] as $animal) {
            $animalDTOs[] = AnimalReadDTO::fromEntity($animal);
        }

        return [
            'data' => $animalDTOs,
            'total' => $result['total'],
            'totalPages' => $result['totalPages'],
            'currentPage' => $result['currentPage'],
            'perPage' => $result['perPage']
        ];
    }
}

?>