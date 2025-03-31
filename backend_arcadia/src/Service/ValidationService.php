<?php

namespace App\Service;

use App\Exception\ValidationException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ValidationService
{
    public function __construct(
        private ValidatorInterface $validator
    ) {}

    public function validate(object $dto, array $groups): void
    {
        $validationErrors = [];
        $errors = $this->validator->validate($dto, null, $groups);
        if (count($errors) > 0) {
            foreach ($errors as $error) {
                $validationErrors[] = $error->getMessage();
            }
            throw new ValidationException($validationErrors);
        }
    }
}

?>
