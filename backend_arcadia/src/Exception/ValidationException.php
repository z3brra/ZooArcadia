<?php

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\HttpException;

class ValidationException extends HttpException
{
    public function __construct(array $errors)
    {
        parent::__construct(422, json_encode(['errors' => $errors]));
    }
}

?>