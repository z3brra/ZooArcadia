<?php

namespace App\Controller;

use App\DTO\Habitat\HabitatDTO;
use App\Service\Habitat\{
    CreateHabitatService,
    ShowHabitatService,
    UpdateHabitatService,
    DeleteHabitatService,
    ListHabitatPaginatedService,
    AddHabitatPictureService,
    ChangeHabitatPictureService,
    RemoveHabitatPictureService
};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\HttpFoundation\File\UploadedFile;

use Symfony\Component\HttpKernel\Exception\{NotFoundHttpException, BadRequestHttpException};

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
                throw new BadRequestHttpException("Invalid JSON format");
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

        } catch (BadRequestHttpException $e) {
            return new JsonResponse(
                data: ['error' => $e->getMessage()],
                status: JsonResponse::HTTP_BAD_REQUEST
            );
        }
    }

    #[Route('/all', name: 'show_all', methods: 'GET')]
    public function showAll(
        ShowHabitatService $showHabitatService
    ): JsonResponse {
        try {
            $habitatReadDTO = $showHabitatService->showAllHabitat();

            $responseData = $this->serializer->serialize(
                data: $habitatReadDTO,
                format: 'json',
                context: ['groups' => ['habitat:all']]
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
                context: ['groups' => ['habitat:read', 'habitat:with-animalCount', 'entity-with-picture:read']]
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
        ShowHabitatService $showHabitatService
    ): JsonResponse {
        try {
            $limit = $request->query->get('limit', null);

            $animals = $showHabitatService->showHabitatAnimals($uuid, $limit);

            $responseData = $this->serializer->serialize(
                data: $animals,
                format: 'json',
                context: ['groups' => ['animal:list']]
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
                throw new BadRequestHttpException("Invalid JSON format");
            }

            $habitatReadDTO = $updateHabitatService->updateHabitat($uuid, $habitatUpdateDTO);

            $responseData = $this->serializer->serialize(
                data: $habitatReadDTO,
                format: 'json',
                context: ['groups' => ['habitat:read']]
            );
            // $location = $this->urlGenerator->generate(
            //     name: 'app_api_habitat_show',
            //     parameters: ['uuid' => $uuid],
            //     referenceType: UrlGeneratorInterface::ABSOLUTE_URL
            // );

            return new JsonResponse(
                data: null,
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
        AddHabitatPictureService $addPictureService
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
        } 
        catch (\Exception $e) {
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
        ChangeHabitatPictureService $changePictureService
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
        RemoveHabitatPictureService $removePictureService
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
                context: ['groups' => ['habitat:list', 'entity-with-picture:read']]
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