<?php

namespace App\Entity;

use App\Repository\HabitatRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

use Ramsey\Uuid\Uuid;

#[ORM\Entity(repositoryClass: HabitatRepository::class)]
class Habitat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 36)]
    private ?string $uuid = null;

    #[ORM\Column(length: 36)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;


    /**
     * @var Collection<int, Animal>
     */
    #[ORM\OneToMany(targetEntity: Animal::class, mappedBy: 'habitat')]
    private Collection $animals;

    /**
     * @var Collection<int, HabitatPicture>
     */
    #[ORM\OneToMany(targetEntity: HabitatPicture::class, mappedBy: 'habitat', orphanRemoval: true, cascade: ['remove'])]
    private Collection $habitatPictures;

    /**
     * @var Collection<int, HabitatReport>
     */
    #[ORM\OneToMany(targetEntity: HabitatReport::class, mappedBy: 'habitat', orphanRemoval: true)]
    private Collection $habitatReports;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $lastState = null;


    public function __construct()
    {
        $this->uuid = Uuid::uuid7()->toString();
        $this->animals = new ArrayCollection();
        $this->habitatPictures = new ArrayCollection();
        $this->habitatReports = new ArrayCollection();
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

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
     * @return Collection<int, Animal>
     */
    public function getAnimals(): Collection
    {
        return $this->animals;
    }

    public function addAnimal(Animal $animal): static
    {
        if (!$this->animals->contains($animal)) {
            $this->animals->add($animal);
            $animal->setHabitat($this);
        }

        return $this;
    }

    public function removeAnimal(Animal $animal): static
    {
        if ($this->animals->removeElement($animal)) {
            // set the owning side to null (unless already changed)
            if ($animal->getHabitat() === $this) {
                $animal->setHabitat(null);
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
            $habitatPicture->setHabitat($this);
        }

        return $this;
    }

    public function removeHabitatPicture(HabitatPicture $habitatPicture): static
    {
        if ($this->habitatPictures->removeElement($habitatPicture)) {
            // set the owning side to null (unless already changed)
            if ($habitatPicture->getHabitat() === $this) {
                $habitatPicture->setHabitat(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, HabitatReport>
     */
    public function getHabitatReports(): Collection
    {
        return $this->habitatReports;
    }

    public function addHabitatReport(HabitatReport $habitatReport): static
    {
        if (!$this->habitatReports->contains($habitatReport)) {
            $this->habitatReports->add($habitatReport);
            $habitatReport->setHabitat($this);
        }

        return $this;
    }

    public function removeHabitatReport(HabitatReport $habitatReport): static
    {
        if ($this->habitatReports->removeElement($habitatReport)) {
            // set the owning side to null (unless already changed)
            if ($habitatReport->getHabitat() === $this) {
                $habitatReport->setHabitat(null);
            }
        }

        return $this;
    }

    public function getLastState(): ?string
    {
        return $this->lastState;
    }

    public function setLastState(?string $lastState): static
    {
        $this->lastState = $lastState;

        return $this;
    }

}
