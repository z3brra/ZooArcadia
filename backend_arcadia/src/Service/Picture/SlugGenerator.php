<?php

namespace App\Service\Picture;

use App\Service\StringHelper;

class SlugGenerator
{
    public function generate(string $filename): string
    {
        $slug = StringHelper::slugify(pathinfo($filename, PATHINFO_FILENAME));

        // Return the entire slug (unique) if filename is too long (+255)
        // TODO : Need a fix / upgrade
        return substr($slug, -255, strlen($slug));
    }
}

?>
