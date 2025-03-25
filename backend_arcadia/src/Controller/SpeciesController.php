<?php

namespace App\Controller;

use App\DTO\SpeciesDTO;
use App\Exception\ValidationException;
use App\Repository\SpeciesRepository;
use App\Service\SpeciesService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse, Response};
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/species', name: 'app_api_species_')]
final class SpeciesController extends AbstractController
{
    public function __construct(
        private SpeciesService $speciesService,
        private EntityManagerInterface $entityManager,
        private SpeciesRepository $repository,
        private SerializerInterface $serializer,
        private UrlGeneratorInterface $urlGenerator
    ){}

    #[Route('/create', name: 'create', methods: 'POST')]
    public function create(
        Request $request,
    ): JsonResponse {
        try {
            try {
                $speciesCreateDTO = $this->serializer->deserialize(
                    $request->getContent(),
                    SpeciesDTO::class,
                    'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestException("Invalid JSON format");
            }

            $speciesReadDTO = $this->speciesService->createSpecies($speciesCreateDTO);

            $responseData = $this->serializer->serialize(
                data: $speciesReadDTO,
                format: 'json',
                context: ['groups' => ['species:read']]
            );
            $location = $this->urlGenerator->generate(
                name: 'app_api_species_show',
                parameters: ['uuid' => $speciesReadDTO->uuid],
                referenceType: UrlGeneratorInterface::ABSOLUTE_URL
            );
            return new JsonResponse(
                data: $responseData,
                status: JsonResponse::HTTP_CREATED,
                headers: ['Location' => $location],
                json: true
            );

        } catch (BadRequestException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_BAD_REQUEST
            );
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
            $speciesReadDTO = $this->speciesService->showSpecies($uuid);

            $responseData = $this->serializer->serialize(
                data: $speciesReadDTO,
                format: 'json',
                context: ['groups' => ['species:read']]
            );

            return new JsonResponse(
                data: $responseData,
                status: JsonResponse::HTTP_OK,
                headers: [],
                json: true
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

    #[Route('/{uuid}/animals', name: 'show_animals', methods: 'GET')]
    public function showAnimals(
        string $uuid
    ): JsonResponse {
        try {
            $animals = $this->speciesService->showSpeciesAnimals($uuid);

            $responseData = $this->serializer->serialize(
                data: $animals,
                format: 'json',
                context: ['groups' => ['animal:read']]);

            return new JsonResponse(
                data: $responseData,
                status: JsonResponse::HTTP_OK,
                headers: [],
                json: true
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

    #[Route('/{uuid}', name: 'update', methods: 'PUT')]
    public function update(
        string $uuid,
        Request $request,
        ValidatorInterface $validator
    ): JsonResponse {
        try {
            try {
                $speciesUpdateDTO = $this->serializer->deserialize(
                    data: $request->getContent(),
                    type: SpeciesDTO::class,
                    format: 'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestException("Invalid JSON format");
            }

            $speciesReadDTO = $this->speciesService->updateSpecies($uuid, $speciesUpdateDTO);

            $responseData = $this->serializer->serialize(
                data: $speciesReadDTO,
                format: 'json',
                context: ['groups' => ['species:read']]
            );
            $location = $this->urlGenerator->generate(
                name: 'app_api_species_show',
                parameters: ['uuid' => $uuid],
                referenceType: UrlGeneratorInterface::ABSOLUTE_URL
            );
            return new JsonResponse(
                data: $responseData,
                status: JsonResponse::HTTP_OK,
                headers: ['Location' => $location],
                json: true
            );

        } catch (NotFoundHttpException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_NOT_FOUND
            );
        } catch (BadRequestException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_BAD_REQUEST
            );
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

    #[Route('/{uuid}', name: 'delete', methods: 'DELETE')]
    public function delete(
        string $uuid
    ): JsonResponse {
        try {
            $this->speciesService->deleteSpecies($uuid);

            return new JsonResponse(
                data: ['message' => 'Species successfully deleted'],
                status: JsonResponse::HTTP_OK
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

    #[Route('', name: 'list', methods: 'GET')]
    public function list(
        Request $request
    ): JsonResponse {
        try {
            $page = max(1, (int) $request->query->get('page', 1));
            $limit = max(1, (int) $request->query->get('limit', 10));

            $speciesPaginated = $this->speciesService->listSpeciesPaginated($page, $limit);

            $responseData = $this->serializer->serialize(
                data: $speciesPaginated,
                format: 'json',
                context: ['groups' => ['species:read']]
            );

            return new JsonResponse(
                data: $responseData,
                status: JsonResponse::HTTP_OK,
                json: true
            );

        } catch (\Exception $e) {
            return new JsonResponse(
                data: ['error' => "An internal server error as occured"],
                status: JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
