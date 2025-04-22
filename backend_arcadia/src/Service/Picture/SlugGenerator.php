<?php

namespace App\Service\Picture;

use App\Service\StringHelper;

class SlugGenerator
{
    public function __construct(
        private StringHelper $stringHelper
    ) {}

    public function generate(string $filename): string
    {
        $slug = $this->stringHelper->slugify(pathinfo($filename, PATHINFO_FILENAME));

        // Return the entire slug (unique) if the filename is too long (+255)
        // TODO : Need a fix / upgrade
        return substr($slug, -255, strlen($slug));
    }
}

?>
