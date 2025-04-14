<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\SerializerInterface;

use Symfony\Component\HttpKernel\Exception\{BadRequestHttpException, NotFoundHttpException};
use Symfony\Component\Validator\Constraints\Json;

#[Route('/api/test', name: 'app_api_test_')]
final class TestController extends AbstractController
{
    #[Route('/create', name: 'create', methods: 'GET')]
    public function testRequest(): JsonResponse
    {
        return new JsonResponse(
            data: ['message' => 'Test message'],
            status: JsonResponse::HTTP_OK
        );
    }
}