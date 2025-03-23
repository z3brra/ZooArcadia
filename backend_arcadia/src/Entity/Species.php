<?php

namespace App\Entity;

use App\Repository\SpeciesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Serializer\Annotation\Groups;
use Ramsey\Uuid\Uuid;

#[ORM\Entity(repositoryClass: SpeciesRepository::class)]
class Species
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 36)]
    #[Groups(['species:read'])]
    private ?string $uuid = null;

    #[ORM\Column(length: 255)]
    #[Groups(['species:read'])]
    private ?string $commonName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['species:read'])]
    private ?string $scientificName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['species:read'])]
    private ?string $lifespan = null;

    #[ORM\Column(length: 255)]
    #[Groups(['species:read'])]
    private ?string $diet = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['species:read'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['species:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['species:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    /**
     * @var Collection<int, Animal>
     */
    #[ORM\OneToMany(targetEntity: Animal::class, mappedBy: 'species', orphanRemoval: true)]
    private Collection $animals;

    /** @throws Exception */
    public function __construct()
    {
        $this->uuid = Uuid::uuid7()->toString();
        $this->animals = new ArrayCollection();
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

    public function getCommonName(): ?string
    {
        return $this->commonName;
    }

    public function setCommonName(string $commonName): static
    {
        $this->commonName = $commonName;

        return $this;
    }

    public function getScientificName(): ?string
    {
        return $this->scientificName;
    }

    public function setScientificName(string $scientificName): static
    {
        $this->scientificName = $scientificName;

        return $this;
    }

    public function getLifespan(): ?string
    {
        return $this->lifespan;
    }

    public function setLifespan(string $lifespan): static
    {
        $this->lifespan = $lifespan;

        return $this;
    }

    public function getDiet(): ?string
    {
        return $this->diet;
    }

    public function setDiet(string $diet): static
    {
        $this->diet = $diet;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
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
            $animal->setSpecies($this);
        }

        return $this;
    }

    public function removeAnimal(Animal $animal): static
    {
        if ($this->animals->removeElement($animal)) {
            // set the owning side to null (unless already changed)
            if ($animal->getSpecies() === $this) {
                $animal->setSpecies(null);
            }
        }

        return $this;
    }
}
