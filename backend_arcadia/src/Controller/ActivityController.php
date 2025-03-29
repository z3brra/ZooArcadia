<?php

namespace App\Controller;

use App\DTO\ActivityDTO;
use App\Service\ActivityService;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\SerializerInterface;

use App\Exception\ValidationException;
use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

#[Route('/api/activity', name: 'app_api_activity_')]
final class ActivityController extends AbstractController
{

    public function __construct(
        private ActivityService $activityService,
        private SerializerInterface $serializer,
        private UrlGeneratorInterface $urlGenerator
    ) {}

    #[Route('/create', name: 'create', methods: 'POST')]
    public function create(
        Request $request
    ): JsonResponse {
        try {
            try {
                $activityCreateDTO = $this->serializer->deserialize(
                    $request->getContent(),
                    ActivityDTO::class,
                    'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestHttpException("Invalid JSON format");
            }

            $activityReadDTO = $this->activityService->createActivity($activityCreateDTO);

            $responseData = $this->serializer->serialize(
                data: $activityReadDTO,
                format: 'json',
                context: ['groups' => ['activity:read']]
            );
            $location = $this->urlGenerator->generate(
                name: 'app_api_activity_show',
                parameters: ['uuid' => $activityReadDTO->uuid],
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
            $activityReadDTO = $this->activityService->showActivity($uuid);

            $responseData = $this->serializer->serialize(
                data: $activityReadDTO,
                format: 'json',
                context: ['groups' => ['activity:read']]
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
        Request $request
    ): JsonResponse {
        try {
            try {
                $activityUpdateDTO = $this->serializer->deserialize(
                    data: $request->getContent(),
                    type: ActivityDTO::class,
                    format: 'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestHttpException("Invalid JSON format");
            }

            $activityReadDTO = $this->activityService->updateActivity($uuid, $activityUpdateDTO);

            $responseData = $this->serializer->serialize(
                data: $activityReadDTO,
                format: 'json',
                context: ['groups' => ['activity:read']]
            );
            $location = $this->urlGenerator->generate(
                name: 'app_api_activity_show',
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
}
