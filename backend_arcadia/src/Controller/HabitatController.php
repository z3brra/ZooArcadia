<?php

// Test commentaire pour CI / CD

namespace App\Controller;

use App\DTO\Habitat\HabitatDTO;
use App\Service\Habitat\{
    CreateHabitatService,
    ShowHabitatService,
    UpdateHabitatService,
    DeleteHabitatService,
    ListHabitatPaginatedService
};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/habitat', name: 'app_api_habitat_')]
final class HabitatController extends AbstractController
{
    public function __construct(
        private SerializerInterface $serializer,
        private UrlGeneratorInterface $urlGenerator
    ) {}

    #[Route('/create', name: 'create', methods: 'POST')]
    public function create(
        Request $request,
        CreateHabitatService $createHabitatService
    ): JsonResponse {
        try {
            try {
                $habitatCreateDTO = $this->serializer->deserialize(
                    $request->getContent(),
                    HabitatDTO::class,
                    'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestException("Invalid JSON format");
            }

            $habitatReadDTO = $createHabitatService->createHabitat($habitatCreateDTO);

            $responseData = $this->serializer->serialize(
                data: $habitatReadDTO,
                format: 'json',
                context: ['groups' => ['habitat:read']]
            );

            $location = $this->urlGenerator->generate(
                name: 'app_api_habitat_show',
                parameters: ['uuid' => $habitatReadDTO->uuid],
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
        }
    }

    #[Route('/{uuid}', name: 'show', methods: 'GET')]
    public function show(
        string $uuid,
        ShowHabitatService $showHabitatService
    ): JsonResponse {
        try {
            $habitatReadDTO = $showHabitatService->showHabitat($uuid);

            $responseData = $this->serializer->serialize(
                data: $habitatReadDTO,
                format: 'json',
                context: ['groups' => ['habitat:read']]
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
        ShowHabitatService $showHabitatService
    ): JsonResponse {
        try {
            $animals = $showHabitatService->showHabitatAnimals($uuid);

            $responseData = $this->serializer->serialize(
                data: $animals,
                format: 'json',
                context: ['groups' => ['animal:read']]
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

    #[Route('/{uuid}', name: 'update', methods: 'PUT')]
    public function update(
        string $uuid,
        Request $request,
        UpdateHabitatService $updateHabitatService
    ): JsonResponse {
        try {
            try {
                $habitatUpdateDTO = $this->serializer->deserialize(
                    data: $request->getContent(),
                    type: HabitatDTO::class,
                    format: 'json',
                );
            } catch (\Exception $e) {
                throw new BadRequestException("Invalid JSON format");
            }

            $habitatReadDTO = $updateHabitatService->updateHabitat($uuid, $habitatUpdateDTO);

            $responseData = $this->serializer->serialize(
                data: $habitatReadDTO,
                format: 'json',
                context: ['groups' => ['habitat:read']]
            );
            $location = $this->urlGenerator->generate(
                name: 'app_api_habitat_show',
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
        }
    }

    #[Route('/{uuid}', name: 'delete', methods: 'DELETE')]
    public function delete(
        string $uuid,
        DeleteHabitatService $deleteHabitatService
    ): JsonResponse {
        try {
            $deleteHabitatService->deleteHabitat($uuid);

            return new JsonResponse(
                data: ['message' => 'Habitat successfully deleted'],
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
        ListHabitatPaginatedService $listHabitatService
    ): JsonResponse {
        try {
            $page = max(1, (int) $request->query->get('page', 1));
            $limit = max(1, (int) $request->query->get('limit', 10));

            $habitatPaginated = $listHabitatService->listHabitatPaginated($page, $limit);

            $responseData = $this->serializer->serialize(
                data: $habitatPaginated,
                format: 'json',
                context: ['groups' => ['habitat:read', 'habitat:with-animalCount']]
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

?>