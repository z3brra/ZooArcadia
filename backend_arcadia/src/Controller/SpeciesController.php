<?php

namespace App\Controller;

use App\DTO\Species\SpeciesDTO;
use App\Service\Species\{
    CreateSpeciesService,
    ShowSpeciesService,
    UpdateSpeciesService,
    DeleteSpeciesService,
    ListSpeciesPaginatedService
};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/species', name: 'app_api_species_')]
final class SpeciesController extends AbstractController
{
    public function __construct(
        private SerializerInterface $serializer,
        private UrlGeneratorInterface $urlGenerator
    ){}

    #[Route('/create', name: 'create', methods: 'POST')]
    public function create(
        Request $request,
        CreateSpeciesService $createSpeciesService
    ): JsonResponse {
        try {
            try {
                $speciesCreateDTO = $this->serializer->deserialize(
                    $request->getContent(),
                    SpeciesDTO::class,
                    'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestHttpException("Invalid JSON format");
            }

            $speciesReadDTO = $createSpeciesService->createSpecies($speciesCreateDTO);

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

        } catch (BadRequestHttpException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_BAD_REQUEST
            );
        }
    }

    #[Route('/{uuid}', name: 'show', methods: 'GET')]
    public function show(
        string $uuid,
        ShowSpeciesService $showSpeciesService
    ): JsonResponse {

        try {
            $speciesReadDTO = $showSpeciesService->showSpecies($uuid);

            $responseData = $this->serializer->serialize(
                data: $speciesReadDTO,
                format: 'json',
                context: ['groups' => ['species:read', 'species:with-animalCount']]
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
        string $uuid,
        Request $request,
        ShowSpeciesService $showSpeciesService
    ): JsonResponse {
        try {
            $limit = $request->query->get('limit', null);
            $animals = $showSpeciesService->showSpeciesAnimals($uuid, $limit);

            $responseData = $this->serializer->serialize(
                data: $animals,
                format: 'json',
                context: ['groups' => ['animal:list']]);

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
        UpdateSpeciesService $updateSpeciesService
    ): JsonResponse {
        try {
            try {
                $speciesUpdateDTO = $this->serializer->deserialize(
                    data: $request->getContent(),
                    type: SpeciesDTO::class,
                    format: 'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestHttpException("Invalid JSON format");
            }

            $speciesReadDTO = $updateSpeciesService->updateSpecies($uuid, $speciesUpdateDTO);

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
        } catch (BadRequestHttpException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_BAD_REQUEST
            );
        }
    }

    #[Route('/{uuid}', name: 'delete', methods: 'DELETE')]
    public function delete(
        string $uuid,
        DeleteSpeciesService $deleteSpeciesService
    ): JsonResponse {
        try {
            $deleteSpeciesService->deleteSpecies($uuid);

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
        Request $request,
        ListSpeciesPaginatedService $listSpeciesService
    ): JsonResponse {
        try {
            $page = max(1, (int) $request->query->get('page', 1));
            $limit = max(1, (int) $request->query->get('limit', 10));

            $speciesPaginated = $listSpeciesService->listSpeciesPaginated($page, $limit);

            $responseData = $this->serializer->serialize(
                data: $speciesPaginated,
                format: 'json',
                context: ['groups' => ['species:list', 'species:with-animalCount']]
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
