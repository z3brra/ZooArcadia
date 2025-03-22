<?php

namespace App\Service;

class Utils
{
    public static function randomPassword() {
        return bin2hex(random_bytes(8));
    }
}

?>