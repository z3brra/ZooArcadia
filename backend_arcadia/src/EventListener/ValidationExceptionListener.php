<?php

namespace App\EventListener;

use App\Exception\ValidationException;

use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpFoundation\JsonResponse;

class ValidationExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        // var_dump('tot');

        if (!$exception instanceof ValidationException) {
            return;
        }
        // var_dump($exception);
        // var_dump('topto');
        $response = new JsonResponse(
            json_decode($exception->getMessage(), true),
            JsonResponse::HTTP_UNPROCESSABLE_ENTITY
        );

        $event->setResponse($response);
    }
}

?>
