<?php

namespace App\EventListener;

use App\Entity\Picture;

use Doctrine\ORM\Event\PostRemoveEventArgs;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class PictureDeletionListener
{
    private string $publicDir;

    public function __construct(
        private ParameterBagInterface $params
    )
    {
        $this->publicDir = $params->get('public_directory');
    }

    public function postRemove(PostRemoveEventArgs $args): void
    {
        $entity = $args->getObject();
        if ($entity instanceof Picture) {

            $filepath = $this->publicDir . $entity->getPath();

            if (file_exists($filepath))
            {
                unlink($filepath);
            }
        }
    }
}

?>