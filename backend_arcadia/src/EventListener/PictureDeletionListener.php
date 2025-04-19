<?php

namespace App\EventListener;

use App\Entity\Picture;
use App\Service\Picture\PictureFileManager;

use Doctrine\ORM\Event\PostRemoveEventArgs;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class PictureDeletionListener
{
    // private string $publicDir;

    public function __construct(
        private PictureFileManager $pictureFileManager,
        private ParameterBagInterface $params
    )
    {
        // $this->publicDir = $params->get('public_directory');
    }

    public function postRemove(PostRemoveEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof Picture) {
            return;
        }
        $this->pictureFileManager->delete($entity->getPath());
    }
}

?>