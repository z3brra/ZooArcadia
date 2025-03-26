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

use App\Exception\ValidationException;
use App\Repository\HabitatRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AnimalService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AnimalRepository $animalRepository,

        private SpeciesRepository $speciesRepository,
        private HabitatRepository $habitatRepository,

        private PictureService $pictureService,

        private ValidatorInterface $validator
    ) {}

    public function createAnimal(AnimalDTO $animalCreateDTO): AnimalReadDTO
    {
        $errors = $this->validator->validate($animalCreateDTO, null, ['create']);
        if (count($errors) > 0) {
            $validationErrors = [];
            foreach ($errors as $error) {
                $validationErrors[] = $error->getMessage();
            }
            throw new ValidationException($validationErrors);
        }

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
            throw new BadRequestException("No data to update");
        }

        $errors = $this->validator->validate($animalUpdateDTO);
        if (count($errors) > 0) {
            $validationErrors = [];
            foreach ($errors as $error) {
                $validationErrors[] = $error->getMessage();
            }
            throw new ValidationException($validationErrors);
        }

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

        $pictureReadDTO = $this->pictureService->createPicture($pictureCreateDTO);

        return $pictureReadDTO;
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