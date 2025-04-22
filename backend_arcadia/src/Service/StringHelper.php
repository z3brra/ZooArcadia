<?php

namespace App\Service;

class StringHelper
{

    public function __construct(
        private string $emailDomain
    ) {}

    public function generateEmail(string $firstName, string $lastName): string
    {
        $firstName = str_replace('-', '_', self::normalizeString($firstName));
        $lastName = str_replace('-', '_', self::normalizeString($lastName));

        if (preg_match("/^(d'|\w{1,3})\s+/i", $lastName, $matches)) {
            $prefix = trim($matches[1]);
            $lastName = substr($lastName, strlen($matches[0]));
            if ($prefix !== "d'") {
                $lastName = str_replace(' ', '_', $prefix) . '_' . $lastName;
            }
        }

        return str_replace(' ', '_', $firstName) . '.' . str_replace(' ', '_', $lastName) . '@'. $this->emailDomain;
    }

    private function normalizeString(string $str): string
    {
        $str = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $str);
        $str = preg_replace('/[^a-zA-Z0-9 _-]/', '', $str);
        return strtolower(trim($str));
    }

    public function slugify($text) {
        $text = iconv('UTF-8', 'ASCII//TRANSLIT', $text);

        $text = preg_replace('/[^a-zA-Z0-9\s-]/', '', str_replace('_', '-', $text));
        $text = preg_replace('/[\s-]+/', '-', $text);

        $text = trim($text, '-');

        return strtolower($text);
    }
}


?>