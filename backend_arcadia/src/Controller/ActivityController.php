<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/activity', name: 'app_api_activity_')]
final class ActivityController extends AbstractController
{
    #[Route('/create', name: 'create', methods: 'POST')]
    public function create(

    ): JsonResponse {

    }
}
