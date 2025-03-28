<?php

namespace App\Controller;

use App\DTO\AnimalDTO;
use App\Exception\ValidationException;
use App\Service\AnimalService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/animal', name: 'app_api_animal_')]
final class AnimalController extends AbstractController
{
    public function __construct(
        private AnimalService $animalService,
        private SerializerInterface $serializer,
        private UrlGeneratorInterface $urlGenerator
    ) {}

    #[Route('/create', name: 'create', methods: 'POST')]
    public function createAnimal(
        Request $request
    ): JsonResponse {
        try {
            try {
                $animalCreateDTO = $this->serializer->deserialize(
                    $request->getContent(),
                    AnimalDTO::class,
                    'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestException("Invalid JSON format");
            }

            $animalReadDTO = $this->animalService->createAnimal($animalCreateDTO);

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
            $animalReadDTO = $this->animalService->showAnimal($uuid);

            $responseData = $this->serializer->serialize(
                data: $animalReadDTO,
                format: 'json',
                context: ['groups' => ['animal:read', 'entity-with-picture: read']]
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
    ): JsonResponse {
        try {
            try {
                $animalUpdateDTO = $this->serializer->deserialize(
                    data: $request->getContent(),
                    type: AnimalDTO::class,
                    format: 'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestException("Invalid JSON format");
            }

            $animalReadDTO = $this->animalService->updateAnimal($uuid, $animalUpdateDTO);

            $responseData = $this->serializer->serialize(
                data: $animalReadDTO,
                format: 'json',
                context: ['groups' => ['animal:read']]
            );

            $location = $this->urlGenerator->generate(
                name: 'app_api_animal_show',
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

    #[Route('/{uuid}/add-picture', name: 'add_picture', methods: 'POST')]
    public function addPicture(
        Request $request,
        string $uuid
    ): JsonResponse {
        try {
            $file = $request->files->get('image');
            if (!$file instanceof UploadedFile) {
                throw new BadRequestException("No image uploaded");
            }

            $pictureReadDTO = $this->animalService->addPicture($uuid, $file);

            $responseData = $this->serializer->serialize(
                data: $pictureReadDTO,
                format: 'json',
                context: ['groups' => ['entity-with-picture: read']]
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
        Request $request,
        string $uuid
    ): JsonResponse {
        try {
            $file = $request->files->get('image');
            if (!$file instanceof UploadedFile) {
                throw new BadRequestException("No image uploaded");
            }

            $pictureUuid = $request->query->get('pictureUuid', null);
            if (!$pictureUuid) {
                throw new BadRequestException("pictureUuid is required in URI parameter");
            }

            $pictureReadDTO = $this->animalService->changePicture($uuid, $pictureUuid, $file);

            $responseData = $this->serializer->serialize(
                data: $pictureReadDTO,
                format: 'json',
                context: ['groups' => ['entity-with-picture: read']]
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

    #[Route('/{uuid}/remove-picture', name: 'remove_picture', methods: 'POST')]
    public function removePicture(
        Request $request,
        string $uuid
    ): JsonResponse {
        try {
            $pictureUuid = $request->query->get('pictureUuid', null);
            if (!$pictureUuid) {
                throw new BadRequestException("pictureUuid is required in URI parameter");
            }

            $this->animalService->removePicture($uuid, $pictureUuid);

            return new JsonResponse(
                data: ['message' => 'Picture successfully removed'],
                status: JsonResponse::HTTP_OK
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
            $this->animalService->deleteAnimal($uuid);

            return new JsonResponse(
                data: ['message' => 'Animal successfully deleted'],
                status: JsonResponse::HTTP_OK
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

    #[Route('', name: 'list', methods: 'GET')]
    public function list(
        Request $request
    ): JsonResponse {
        try {
            $page = max(1, (int) $request->query->get('page', 1));
            $limit = max(1, (int) $request->query->get('limit', 10));

            $animalPaginated = $this->animalService->listAnimalPaginated($page, $limit);

            $responseData = $this->serializer->serialize(
                data: $animalPaginated,
                format: 'json',
                context: ['groups' => ['animal:read', 'entity-with-picture: read']]
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