<?php

namespace App\Service\Picture;

use Exception;
use RuntimeException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class PictureFileManager
{
    private string $publicDir;
    private string $uploadRelativeDir;

    public function __construct(
        private ParameterBagInterface $params
    ) {
        $this->publicDir = $params->get('public_directory');
        $this->uploadRelativeDir = $params->get('upload_relative_directory');
    }

    public function save(string $filename, UploadedFile $file): string
    {
        $uploadDir = $this->publicDir . $this->uploadRelativeDir;

        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0777, true)) {
            throw new RuntimeException("Unable to create upload directory : " . $uploadDir);
        }

        try {
            $file->move($uploadDir, $filename);
        } catch (Exception $e) {
            throw new RuntimeException("File upload failed : " . $e->getMessage());
        }

        return $this->uploadRelativeDir . $filename;
    }

    public function delete(string $relativePath): bool
    {
        $filepath = $this->publicDir . $relativePath;
        if (is_file($filepath)) {
            unlink($filepath);
            return true;
        }
        return false;
    }

}


?>
