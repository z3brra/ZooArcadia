<?php

namespace App\EventListener;

use App\Entity\Picture;
use App\Service\PictureService;

use Doctrine\ORM\Event\PostRemoveEventArgs;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class PictureDeletionListener
{
    private string $publicDir;

    public function __construct(
        private PictureService $pictureService,
        private ParameterBagInterface $params

    )
    {
        $this->publicDir = $params->get('public_directory');
    }

    public function postRemove(PostRemoveEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof Picture) {
            return;
        }
        $this->pictureService->deleteFilePicture($entity->getPath());
    }
}

?>