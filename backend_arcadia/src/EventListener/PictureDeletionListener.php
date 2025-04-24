<?php

namespace App\EventListener;

use App\Entity\Picture;
use App\Service\Picture\PictureFileManager;

use Doctrine\ORM\Event\PostRemoveEventArgs;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class PictureDeletionListener
{
    public function __construct(
        private PictureFileManager $pictureFileManager,
    ) {}

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