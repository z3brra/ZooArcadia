<?php

namespace App\Entity;

use App\Repository\AnimalRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

use Ramsey\Uuid\Uuid;

#[ORM\Entity(repositoryClass: AnimalRepository::class)]
class Animal
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 36)]
    private ?string $uuid = null;

    #[ORM\Column(length: 36)]
    private ?string $name = null;

    #[ORM\Column]
    private ?bool $isMale = null;

    #[ORM\Column]
    private ?int $size = null;

    #[ORM\Column]
    private ?int $weight = null;

    #[ORM\Column]
    private ?bool $isFertile = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $birthDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $arrivalDate = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'animals')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Species $species = null;

    #[ORM\ManyToOne(inversedBy: 'animals')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Habitat $habitat = null;

    /**
     * @var Collection<int, AnimalPicture>
     */
    #[ORM\OneToMany(targetEntity: AnimalPicture::class, mappedBy: 'animal', orphanRemoval: true, cascade: ['remove'])]
    private Collection $animalPictures;

    /**
     * @var Collection<int, AnimalReport>
     */
    #[ORM\OneToMany(targetEntity: AnimalReport::class, mappedBy: 'animal', orphanRemoval: true)]
    private Collection $animalReports;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $lastState = null;

    /** @throws Exception */
    public function __construct()
    {
        $this->uuid = Uuid::uuid7()->toString();
        $this->animalPictures = new ArrayCollection();
        $this->animalReports = new ArrayCollection();
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

    public function isMale(): ?bool
    {
        return $this->isMale;
    }

    public function setIsMale(bool $isMale): static
    {
        $this->isMale = $isMale;

        return $this;
    }

    public function getSize(): ?int
    {
        return $this->size;
    }

    public function setSize(int $size): static
    {
        $this->size = $size;

        return $this;
    }

    public function getWeight(): ?int
    {
        return $this->weight;
    }

    public function setWeight(int $weight): static
    {
        $this->weight = $weight;

        return $this;
    }

    public function isFertile(): ?bool
    {
        return $this->isFertile;
    }

    public function setIsFertile(bool $isFertile): static
    {
        $this->isFertile = $isFertile;

        return $this;
    }

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(\DateTimeInterface $birthDate): static
    {
        $this->birthDate = $birthDate;

        return $this;
    }

    public function getArrivalDate(): ?\DateTimeInterface
    {
        return $this->arrivalDate;
    }

    public function setArrivalDate(\DateTimeInterface $arrivalDate): static
    {
        $this->arrivalDate = $arrivalDate;

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

    public function getSpecies(): ?Species
    {
        return $this->species;
    }

    public function setSpecies(?Species $species): static
    {
        $this->species = $species;

        return $this;
    }

    public function getHabitat(): ?Habitat
    {
        return $this->habitat;
    }

    public function setHabitat(?Habitat $habitat): static
    {
        $this->habitat = $habitat;

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
            $animalPicture->setAnimal($this);
        }

        return $this;
    }

    public function removeAnimalPicture(AnimalPicture $animalPicture): static
    {
        if ($this->animalPictures->removeElement($animalPicture)) {
            // set the owning side to null (unless already changed)
            if ($animalPicture->getAnimal() === $this) {
                $animalPicture->setAnimal(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, AnimalReport>
     */
    public function getAnimalReports(): Collection
    {
        return $this->animalReports;
    }

    public function addAnimalReport(AnimalReport $animalReport): static
    {
        if (!$this->animalReports->contains($animalReport)) {
            $this->animalReports->add($animalReport);
            $animalReport->setAnimal($this);
        }

        return $this;
    }

    public function removeAnimalReport(AnimalReport $animalReport): static
    {
        if ($this->animalReports->removeElement($animalReport)) {
            // set the owning side to null (unless already changed)
            if ($animalReport->getAnimal() === $this) {
                $animalReport->setAnimal(null);
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
