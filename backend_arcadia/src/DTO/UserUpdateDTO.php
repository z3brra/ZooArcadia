<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class UserUpdateDTO
{
    #[Assert\Length(max: 32, maxMessage: "firstname can't exceed 32 char")]
    public ?string $firstName = null;

    #[Assert\Length(max:64, maxMessage: "lastname can't exceed 64 char")]
    public ?string $lastName = null;

    #[Assert\Choice(choices:["ROLE_EMPLOYEE", "ROLE_VET"], message: "user role must be ROLE_EMPLOYEE or ROLE_VET")]
    public ?string $role = null;
}

?>