<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class UserCreateDTO
{
    #[Assert\NotBlank(message: "firstname is mandatory")]
    #[Assert\Length(min: 2, minMessage: "lastname must have at least 2 chars", max: 32, maxMessage: "firstname can't exceed 32 char")]
    public string $firstName;

    #[Assert\NotBlank(message: "lastname is mandatory")]
    #[Assert\Length(min: 2, minMessage: "lastname must have at least 2 chars", max:64, maxMessage: "lastname can't exceed 64 char")]
    public string $lastName;

    #[Assert\NotBlank(message: "user role is mandatory")]
    #[Assert\Choice(choices:["ROLE_EMPLOYEE", "ROLE_VET"], message: "user role must be ROLE_EMPLOYEE or ROLE_VET")]
    public string $role;
}

?>