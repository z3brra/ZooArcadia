<?php

namespace App\Controller;

use App\DTO\SpeciesCreateDTO;
use App\Entity\Species;
use App\Exception\ValidationException;
use App\Repository\SpeciesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse, Response};
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/species', name: 'app_api_species_')]
final class SpeciesController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SpeciesRepository $repository,
        private SerializerInterface $serializer
    ){}

    #[Route('/create', name: 'create', methods: 'POST')]
    public function create(
        Request $request,
        ValidatorInterface $validator
    ): JsonResponse {

        try {
            $speciesCreateDTO = $this->serializer->deserialize(
                $request->getContent(),
                SpeciesCreateDTO::class,
                'json'
            );

            $errors = $validator->validate($speciesCreateDTO);
            if (count($errors) > 0) {
                $validationErrors = [];
                foreach ($errors as $error) {
                    $validationErrors[] = $error->getMessage();
                }
                throw new ValidationException($validationErrors);
            }

            $species = new Species();
            $species->setCommonName($speciesCreateDTO->commonName);
            $species->setScientificName($speciesCreateDTO->scientificName);
            $species->setLifespan($speciesCreateDTO->lifespan);
            $species->setDiet($speciesCreateDTO->diet);
            $species->setDescription($speciesCreateDTO->description);

            $species->setCreatedAt(new \DateTimeImmutable());

            $this->entityManager->persist($species);
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Species successfully created',
            ], JsonResponse::HTTP_CREATED);

        } catch (ValidationException $e) {
            return new JsonResponse(
                data: json_decode($e->getMessage(), true),
                status: JsonResponse::HTTP_UNPROCESSABLE_ENTITY
            );
        } catch (\Exception $e) {
            return new JsonResponse(
                data: ['error' => "An internal server error as occured"],
                status: JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/{uuid}', name: 'show', methods: 'GET')]
    public function show(
        string $uuid
    ): JsonResponse {

        try {
            $species = $this->repository->findOneBy(['uuid' => $uuid]);

            if (!$species) {
                throw new NotFoundHttpException("Species not found or does not exist");
            }

            $responseData = $this->serializer->serialize($species, 'json');
            return new JsonResponse(
                $responseData,
                JsonResponse::HTTP_OK,
                [],
                true
            );

        } catch (NotFoundHttpException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_NOT_FOUND
            );
        } catch (\Exception $e) {
            return new JsonResponse(
                data: ['error' => "An internal server error as occured"],
                status: JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }

    }
}
