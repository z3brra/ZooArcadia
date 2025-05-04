<?php

namespace App\Controller;

use App\DTO\Animal\AnimalDTO;
use App\Service\Animal\{
    CreateAnimalService,
    ShowAnimalService,
    UpdateAnimalService,
    DeleteAnimalService,
    ListAnimalPaginatedService,
    AddAnimalPictureService,
    ChangeAnimalPictureService,
    RemoveAnimalPictureService
};

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\HttpFoundation\File\UploadedFile;

use Symfony\Component\HttpKernel\Exception\{NotFoundHttpException, BadRequestHttpException};

use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/animal', name: 'app_api_animal_')]
final class AnimalController extends AbstractController
{
    public function __construct(
        private SerializerInterface $serializer,
        private UrlGeneratorInterface $urlGenerator
    ) {}

    #[Route('/create', name: 'create', methods: 'POST')]
    public function createAnimal(
        Request $request,
        CreateAnimalService $createAnimalService
    ): JsonResponse {
        try {
            try {
                $animalCreateDTO = $this->serializer->deserialize(
                    $request->getContent(),
                    AnimalDTO::class,
                    'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestHttpException("Invalid JSON format");
            }

            $animalReadDTO = $createAnimalService->createAnimal($animalCreateDTO);

            $responseData = $this->serializer->serialize(
                data: $animalReadDTO,
                format: 'json',
                context: ['groups' => ['animal:read']]
            );

            $location = $this->urlGenerator->generate(
                name: 'app_api_animal_show',
                parameters: ['uuid' => $animalReadDTO->uuid],
                referenceType: UrlGeneratorInterface::ABSOLUTE_URL
            );

            return new JsonResponse(
                data: $responseData,
                status: JsonResponse::HTTP_CREATED,
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

    #[Route('/{uuid}', name: 'show', methods: 'GET')]
    public function show(
        string $uuid,
        ShowAnimalService $showAnimalService
    ): JsonResponse {
        try {
            $animalReadDTO = $showAnimalService->showAnimal($uuid);

            $responseData = $this->serializer->serialize(
                data: $animalReadDTO,
                format: 'json',
                context: ['groups' => ['animal:read', 'entity-with-picture:read']]
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
        UpdateAnimalService $updateAnimalService
    ): JsonResponse {
        try {
            try {
                $animalUpdateDTO = $this->serializer->deserialize(
                    data: $request->getContent(),
                    type: AnimalDTO::class,
                    format: 'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestHttpException("Invalid JSON format");
            }

            $animalReadDTO = $updateAnimalService->updateAnimal($uuid, $animalUpdateDTO);

            $responseData = $this->serializer->serialize(
                data: $animalReadDTO,
                format: 'json',
                context: ['groups' => ['animal:read']]
            );

            // $location = $this->urlGenerator->generate(
            //     name: 'app_api_animal_show',
            //     parameters: ['uuid' => $uuid],
            //     referenceType: UrlGeneratorInterface::ABSOLUTE_URL
            // );

            return new JsonResponse(
                data: $responseData,
                status: JsonResponse::HTTP_OK,
                // headers: ['Location' => $location],
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
        AddAnimalPictureService $addPictureService
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
        ChangeAnimalPictureService $changePictureService
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
        }
    }

    #[Route('/{uuid}/remove-picture', name: 'remove_picture', methods: 'POST')]
    public function removePicture(
        string $uuid,
        Request $request,
        RemoveAnimalPictureService $removePictureService
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
        DeleteAnimalService $deleteAnimalService
    ): JsonResponse {
        try {
            $deleteAnimalService->deleteAnimal($uuid);

            return new JsonResponse(
                data: ['message' => 'Animal successfully deleted'],
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
        ListAnimalPaginatedService $listAnimalService
    ): JsonResponse {
        try {
            $page = max(1, (int) $request->query->get('page', 1));
            $limit = max(1, (int) $request->query->get('limit', 10));

            $animalPaginated = $listAnimalService->listAnimalPaginated($page, $limit);

            $responseData = $this->serializer->serialize(
                data: $animalPaginated,
                format: 'json',
                context: ['groups' => ['animal:list', 'entity-with-picture:read']]
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