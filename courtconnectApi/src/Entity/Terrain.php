<?php

namespace App\Entity;

use App\Repository\TerrainRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TerrainRepository::class)]
class Terrain
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['terrain'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['terrain'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['terrain'])]
    private ?string $adresse = null;

    #[ORM\Column(length: 255)]
    #[Groups(['terrain'])]
    private ?string $ville = null;

    #[ORM\Column(length: 255)]
    #[Groups(['terrain'])]
    private ?string $code_postal = null;

    #[ORM\Column]
    #[Groups(['terrain'])]
    private ?float $latitude = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['terrain'])]
    private ?float $longitude = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['terrain'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(length: 255)]
    #[Groups(['terrain'])]
    private ?string $sol = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['terrain'])]
    private ?int $nb_panier = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['terrain'])]
    private ?string $type_filet = null;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['terrain'])]
    private ?bool $spectateur = null;

    #[ORM\ManyToOne(inversedBy: 'terrains')]
    #[Groups(['terrain'])]
    private ?User $created_by = null;

    /**
     * @var Collection<int, Event>
     */
    #[ORM\OneToMany(targetEntity: Event::class, mappedBy: 'terrain')]
    private Collection $events;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'favori')]
    private Collection $favori;

    #[ORM\Column(length: 255)]
    private ?string $etat = null;

    #[ORM\Column(length: 255)]
    private ?string $remarque = null;

    #[ORM\Column(length: 255)]
    private ?string $type_panier = null;

    #[ORM\Column(type: 'integer')]
    private ?int $usure = null;

    #[ORM\Column(length: 255)]
    private ?string $image_url = null;

    public function __construct()
    {
        $this->events = new ArrayCollection();
        $this->favori = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(string $adresse): static
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(string $ville): static
    {
        $this->ville = $ville;

        return $this;
    }

    public function getCodePostal(): ?string
    {
        return $this->code_postal;
    }

    public function setCodePostal(string $code_postal): static
    {
        $this->code_postal = $code_postal;

        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(float $latitude): static
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(float $longitude): static
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getSol(): ?string
    {
        return $this->sol;
    }

    public function setSol(string $sol): static
    {
        $this->sol = $sol;

        return $this;
    }

    public function getNbPanier(): ?int
    {
        return $this->nb_panier;
    }

    public function setNbPanier(int $nb_panier): static
    {
        $this->nb_panier = $nb_panier;

        return $this;
    }

    public function getTypeFilet(): ?bool
    {
        return $this->type_filet;
    }

    public function setTypeFilet(string $filet): static
    {
        $this->type_filet = $filet;

        return $this;
    }

    public function isSpectateur(): ?bool
    {
        return $this->spectateur;
    }

    public function setSpectateur(bool $spectateur): static
    {
        $this->spectateur = $spectateur;

        return $this;
    }

    public function getCreatedBy(): ?User
    {
        return $this->created_by;
    }

    public function setCreatedBy(?User $created_by): static
    {
        $this->created_by = $created_by;

        return $this;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): static
    {
        if (!$this->events->contains($event)) {
            $this->events->add($event);
            $event->setTerrain($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): static
    {
        if ($this->events->removeElement($event)) {
            // set the owning side to null (unless already changed)
            if ($event->getTerrain() === $this) {
                $event->setTerrain(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getFavori(): Collection
    {
        return $this->favori;
    }

    public function addFavori(User $favori): static
    {
        if (!$this->favori->contains($favori)) {
            $this->favori->add($favori);
        }

        return $this;
    }

    public function removeFavori(User $favori): static
    {
        $this->favori->removeElement($favori);

        return $this;
    }

    public function getEtat(): ?string
    {
        return $this->etat;
    }

    public function setEtat(string $etat): static
    {
        $this->etat = $etat;

        return $this;
    }

    public function getRemarque(): ?string
    {
        return $this->remarque;
    }

    public function setRemarque(string $remarque): static
    {
        $this->remarque = $remarque;

        return $this;
    }

    public function getTypePanier(): ?string
    {
        return $this->type_panier;
    }

    public function setTypePanier(string $type_panier): static
    {
        $this->type_panier = $type_panier;

        return $this;
    }

    public function getUsure(): ?int
    {
        return $this->usure;
    }

    public function setUsure(int $usure): static
    {
        $this->usure = $usure;

        return $this;
    }

    public function getImageUrl(): ?string
    {
        return $this->image_url;
    }

    public function setImageUrl(string $image): static
    {
        $this->image_url = $image;

        return $this;
    }
}
