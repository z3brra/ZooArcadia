<?php

namespace App\Entity;

use App\Repository\PictureRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use Ramsey\Uuid\Uuid;

#[ORM\Entity(repositoryClass: PictureRepository::class)]
class Picture
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 36)]
    private ?string $uuid = null;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    #[ORM\Column(length: 255)]
    private ?string $path = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    /**
     * @var Collection<int, AnimalPicture>
     */
    #[ORM\OneToMany(targetEntity: AnimalPicture::class, mappedBy: 'picture', cascade: ['persist', 'remove'])]
    private Collection $animalPictures;

    /**
     * @var Collection<int, HabitatPicture>
     */
    #[ORM\OneToMany(targetEntity: HabitatPicture::class, mappedBy: 'picture', cascade: ['persist', 'remove'])]
    private Collection $habitatPictures;

    /**
     * @var Collection<int, ActivityPicture>
     */
    #[ORM\OneToMany(targetEntity: ActivityPicture::class, mappedBy: 'picture', cascade: ['persist', 'remove'])]
    private Collection $activityPictures;

    public function __construct()
    {
        $this->uuid = Uuid::uuid7()->toString();
        $this->animalPictures = new ArrayCollection();
        $this->habitatPictures = new ArrayCollection();
        $this->activityPictures = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): static
    {
        $this->uuid = $uuid;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): static
    {
        $this->path = $path;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection<int, AnimalPicture>
     */
    public function getAnimalPictures(): Collection
    {
        return $this->animalPictures;
    }

    public function addAnimalPicture(AnimalPicture $animalPicture): static
    {
        if (!$this->animalPictures->contains($animalPicture)) {
            $this->animalPictures->add($animalPicture);
            $animalPicture->setPicture($this);
        }

        return $this;
    }

    public function removeAnimalPicture(AnimalPicture $animalPicture): static
    {
        if ($this->animalPictures->removeElement($animalPicture)) {
            // set the owning side to null (unless already changed)
            if ($animalPicture->getPicture() === $this) {
                $animalPicture->setPicture(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, HabitatPicture>
     */
    public function getHabitatPictures(): Collection
    {
        return $this->habitatPictures;
    }

    public function addHabitatPicture(HabitatPicture $habitatPicture): static
    {
        if (!$this->habitatPictures->contains($habitatPicture)) {
            $this->habitatPictures->add($habitatPicture);
            $habitatPicture->setPicture($this);
        }

        return $this;
    }

    public function removeHabitatPicture(HabitatPicture $habitatPicture): static
    {
        if ($this->habitatPictures->removeElement($habitatPicture)) {
            // set the owning side to null (unless already changed)
            if ($habitatPicture->getPicture() === $this) {
                $habitatPicture->setPicture(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ActivityPicture>
     */
    public function getActivityPictures(): Collection
    {
        return $this->activityPictures;
    }

    public function addActivityPicture(ActivityPicture $activityPicture): static
    {
        if (!$this->activityPictures->contains($activityPicture)) {
            $this->activityPictures->add($activityPicture);
            $activityPicture->setPicture($this);
        }

        return $this;
    }

    public function removeActivityPicture(ActivityPicture $activityPicture): static
    {
        if ($this->activityPictures->removeElement($activityPicture)) {
            // set the owning side to null (unless already changed)
            if ($activityPicture->getPicture() === $this) {
                $activityPicture->setPicture(null);
            }
        }

        return $this;
    }
}
