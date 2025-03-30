<?php

namespace App\Controller;

use App\DTO\RatesDTO;
use App\Entity\Rates;
use App\Service\RatesService;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\SerializerInterface;

use App\Exception\ValidationException;
use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};

#[Route('/api/rates', name: 'app_api_rates_')]
final class RatesController extends AbstractController
{
    public function __construct(
        private RatesService $ratesService,
        private SerializerInterface $serializer,
        private UrlGeneratorInterface $urlGenerator
    ) {}

    #[Route('/create', name: 'create', methods: 'POST')]
    public function create(
        Request $request
    ): JsonResponse {
        try {
            try {
                $ratesCreateDTO = $this->serializer->deserialize(
                    data: $request->getContent(),
                    type: RatesDTO::class,
                    format: 'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestHttpException("Invalid JSON format");
            }

            $ratesReadDTO = $this->ratesService->createRates($ratesCreateDTO);

            $responseData = $this->serializer->serialize(
                data: $ratesReadDTO,
                format: 'json',
                context: ['groups' => ['rates:read']]
            );
            $location = $this->urlGenerator->generate(
                name: 'app_api_rates_show',
                parameters: ['uuid' => $ratesReadDTO->uuid],
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
            $ratesReadDTO = $this->ratesService->showRates($uuid);

            $responseData = $this->serializer->serialize(
                data: $ratesReadDTO,
                format: 'json',
                context: ['groups' => ['rates:read']]
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
        Request $request,
        string $uuid
    ): JsonResponse {
        try {
            try {
                $ratesUpdateDTO = $this->serializer->deserialize(
                    data: $request->getContent(),
                    type: RatesDTO::class,
                    format: 'json'
                );
            } catch (\Exception $e) {
                throw new BadRequestHttpException("Invalid JSON format");
            }

            $ratesReadDTO = $this->ratesService->updateRates($uuid, $ratesUpdateDTO);

            $responseData = $this->serializer->serialize(
                data: $ratesReadDTO,
                format: 'json',
                context: ['groups' => ['rates:read']]
            );
            $location = $this->urlGenerator->generate(
                name: 'app_api_rates_show',
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

    #[Route('/{uuid}', name: 'delete', methods: 'DELETE')]
    public function delete(
        string $uuid
    ): JsonResponse {
        try {
            $this->ratesService->deleteRates($uuid);

            return new JsonResponse(
                data: ['message' => 'Rates successfully deleted'],
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
}



?>
