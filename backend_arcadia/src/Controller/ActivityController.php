<?php

namespace App\Controller;

use App\DTO\Activity\ActivityDTO;
use App\Service\Activity\{
    CreateActivityService,
    ShowActivityService,
    UpdateActivityService,
    DeleteActivityService,
    ListActivityPaginatedService,
    AddActivityPictureService,
    ChangeActivityPictureService,
    RemoveActivityPictureService
};

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\HttpFoundation\File\UploadedFile;

use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\SerializerInterface;

use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

#[Route('/api/activity', name: 'app_api_activity_')]
final class ActivityController extends AbstractController
{

    public function __construct(
        private SerializerInterface $serializer,
        private UrlGeneratorInterface $urlGenerator
    ) {}

    #[Route('/create', name: 'create', methods: 'POST')]
    public function create(
        Request $request,
        CreateActivityService $createActivityService
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

            $activityReadDTO = $createActivityService->createActivity($activityCreateDTO);

            $responseData = $this->serializer->serialize(
                data: $activityReadDTO,
                format: 'json',
                context: ['groups' => ['activity:read', 'activity:with-rates']]
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
        }
    }

    #[Route('/{uuid}', name: 'show', methods: 'GET')]
    public function show(
        string $uuid,
        ShowActivityService $showActivityService
    ): JsonResponse {
        try {
            $activityReadDTO = $showActivityService->showActivity($uuid);

            $responseData = $this->serializer->serialize(
                data: $activityReadDTO,
                format: 'json',
                context: ['groups' => ['activity:read', 'activity:with-rates']]
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
        UpdateActivityService $updateActivityService
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

            $activityReadDTO = $updateActivityService->updateActivity($uuid, $activityUpdateDTO);

            $responseData = $this->serializer->serialize(
                data: $activityReadDTO,
                format: 'json',
                context: ['groups' => ['activity:read', 'activity:with-rates']]
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
        }
    }

    #[Route('/{uuid}/add-picture', name: 'add_picture', methods: 'POST')]
    public function addPicture(
        string $uuid,
        Request $request,
        AddActivityPictureService $addPictureService
    ): JsonResponse {
        try {
            $file = $request->files->get('image');
            if (!$file instanceof UploadedFile) {
                throw new BadRequestHttpException("No image uploaded");
            }

            $pictureReadDTO = $addPictureService->addPicture($uuid, $file);

            $responseData = $this->serializer->serialize(
                data: $pictureReadDTO,
                format: 'json',
                context: ['groups' => ['entity-with-picture:read']]
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
        } catch (BadRequestHttpException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_BAD_REQUEST
            );
        } catch (\Exception $e) {
            return new JsonResponse(
                data: ['error' => "An internal server error as occured"],
                status: JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/{uuid}/change-picture', name: 'change_picture', methods: 'POST')]
    public function changePicture(
        string $uuid,
        Request $request,
        ChangeActivityPictureService $changePictureService
    ): JsonResponse {
        try {
            $file = $request->files->get('image');
            if (!$file instanceof UploadedFile) {
                throw new BadRequestHttpException("No image uploaded");
            }

            $pictureUuid = $request->query->get('pictureUuid', null);
            if (!$pictureUuid) {
                throw new BadRequestHttpException("pictureUuid is required in URI parameter");
            }

            $pictureReadDTO = $changePictureService->changePicture($uuid, $pictureUuid, $file);

            $responseData = $this->serializer->serialize(
                data: $pictureReadDTO,
                format: 'json',
                context: ['groups' => ['entity-with-picture:read']]
            );

            return new JsonResponse(
                data : $responseData,
                status: JsonResponse::HTTP_OK,
                headers: [],
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

    #[Route('/{uuid}/remove-picture', name:'remove_picture', methods: 'POST')]
    public function removePicture(
        string $uuid,
        Request $request,
        RemoveActivityPictureService $removePictureService
    ): JsonResponse {
        try {
            $pictureUuid = $request->query->get('pictureUuid', null);
            if (!$pictureUuid) {
                throw new BadRequestHttpException("pictureUuid is required in URI parameter");
            }

            $removePictureService->removePicture($uuid, $pictureUuid);

            return new JsonResponse(
                data: ['message' => 'Picture successfully removed'],
                status: JsonResponse::HTTP_OK
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
        } catch (\Exception $e) {
            return new JsonResponse(
                data: ['error' => "An internal server error as occured"],
                status: JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/{uuid}', name: 'delete', methods: 'DELETE')]
    public function delete(
        string $uuid,
        DeleteActivityService $deleteActivityService
    ): JsonResponse {
        try {
            $deleteActivityService->deleteActivity($uuid);

            return new JsonResponse(
                data: ['message' => 'Activity successfully deleted'],
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
        ListActivityPaginatedService $listActivityService
    ): JsonResponse {
        try {
            $page = max(1, (int) $request->query->get('page', 1));
            $limit = max(1, (int) $request->query->get('limit', 10));

            $activityPaginated = $listActivityService->listActivityPaginated($page, $limit);

            $responseData = $this->serializer->serialize(
                data: $activityPaginated,
                format: 'json',
                context: ['groups' => ['activity:list', 'entity-with-picture:read']]
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
