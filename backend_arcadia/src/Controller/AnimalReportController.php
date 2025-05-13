<?php

namespace App\Controller;

use App\DTO\AnimalReport\AnimalReportDTO;
use App\Service\AnimalReport\{
    CreateAnimalReportService,
    ShowAnimalReportService,
    ListAnimalReportPaginatedService,
    UpdateAnimalReportService,
    DeleteAnimalReportService
};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};

use Symfony\Component\HttpKernel\Exception\{NotFoundHttpException, BadRequestHttpException};

use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/animal-report', name: 'app_api_animal_report_')]
final class AnimalReportController extends AbstractController
{
    public function __construct(
        private SerializerInterface $serializer,
    ) {}

    #[Route('/create', name: 'create', methods: 'POST')]
    public function create(
        Request $request,
        CreateAnimalReportService $createReportService
    ): JsonResponse {
        try {
            try {
                $reportCreateDTO = $this->serializer->deserialize(
                    $request->getContent(),
                    AnimalReportDTO::class,
                    'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestHttpException("Invalid JSON format");
            }

            $reportReadDTO = $createReportService->createReport($reportCreateDTO);

            $responseData = $this->serializer->serialize(
                data: $reportReadDTO,
                format: 'json',
                context: ['groups' => ['animal-report:read']]
            );

            return new JsonResponse(
                data: $responseData,
                status: JsonResponse::HTTP_CREATED,
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
        ShowAnimalReportService $showReportService
    ): JsonResponse {
        try {
            $reportReadDTO = $showReportService->showReport($uuid);

            $responseData = $this->serializer->serialize(
                data: $reportReadDTO,
                format: 'json',
                context: ['groups' => ['animal-report:read']]
            );

            return new JsonResponse(
                data: $responseData,
                status: JsonResponse::HTTP_OK,
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
        UpdateAnimalReportService $updateReportService
    ): JsonResponse {
        try {
            try {
                $reportUpdateDTO = $this->serializer->deserialize(
                    data: $request->getContent(),
                    type: AnimalReportDTO::class,
                    format: 'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestHttpException("Invalid JSON format");
            }

            $reportReadDTO = $updateReportService->updateReport($uuid, $reportUpdateDTO);

            $responseData = $this->serializer->serialize(
                data: $reportReadDTO,
                format: 'json',
                context: ['groups' => ['animal-report:read']]
            );

            return new JsonResponse(
                data: $responseData,
                status: JsonResponse::HTTP_OK,
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
        DeleteAnimalReportService $deleteReportService
    ): JsonResponse {
        try {
            $deleteReportService->deleteReport($uuid);

            return new JsonResponse(
                data: ['message' => 'Animal report successfully deleted'],
                status: JsonResponse::HTTP_OK,
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
        ListAnimalReportPaginatedService $listReportService
    ): JsonResponse {
        try {
            $page = max(1, (int) $request->query->get('page', 1));
            $limit = max(1, (int) $request->query->get('limit', 10));

            $reportPaginated = $listReportService->listReportPaginated($page, $limit);

            $responseData = $this->serializer->serialize(
                data: $reportPaginated,
                format: 'json',
                context: ['groups' => ['animal-report:list']]
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