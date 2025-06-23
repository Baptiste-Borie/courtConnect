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
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?string $adresse = null;

    #[ORM\Column(length: 255)]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?string $ville = null;

    #[ORM\Column(length: 255)]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?string $code_postal = null;

    #[ORM\Column]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?float $latitude = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?float $longitude = null;

    #[ORM\Column]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?int $nb_panier = null;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?bool $spectateur = null;

    #[ORM\ManyToOne(inversedBy: 'terrains')]
    #[ORM\JoinColumn(name: 'created_by', referencedColumnName: 'id', onDelete:"SET NULL")]
    #[Groups(['terrain', 'all_events'])]
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
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?int $etat = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?string $remarque = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    private ?int $usure = null;

    #[ORM\ManyToOne(inversedBy: 'terrains')]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    #[ORM\JoinColumn(name: 'type_filet', referencedColumnName: 'id')]
    private ?TypeFilet $type_filet = null;

    #[ORM\ManyToOne(inversedBy: 'terrains')]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    #[ORM\JoinColumn(name: 'type_panier', referencedColumnName: 'id')]
    private ?TypePanier $type_panier = null;

    #[ORM\ManyToOne(inversedBy: 'terrains')]
    #[Groups(['terrain', 'all_events', 'createdByUser'])]
    #[ORM\JoinColumn(name: 'type_sol', referencedColumnName: 'id')]
    private ?TypeSol $type_sol = null;

    #[ORM\Column(nullable: true)]
    private ?int $Vote_valide = null;

    #[ORM\Column(nullable: true)]
    private ?int $Vote_refuse = null;

    /**
     * @var Collection<int, Vote>
     */
    #[ORM\OneToMany(targetEntity: Vote::class, mappedBy: 'terrain', cascade: ['persist', 'remove'], orphanRemoval: true)]
    private Collection $votes;

    #[ORM\Column(nullable: true)]
    private ?int $etat_delete = null;

    public function __construct()
    {
        $this->events = new ArrayCollection();
        $this->favori = new ArrayCollection();
        $this->votes = new ArrayCollection();
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

    public function getNbPanier(): ?int
    {
        return $this->nb_panier;
    }

    public function setNbPanier(int $nb_panier): static
    {
        $this->nb_panier = $nb_panier;

        return $this;
    }

    public function getTypeFilet(): ?TypeFilet
    {
        return $this->type_filet;
    }

    public function setTypeFilet(TypeFilet $filet): static
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

    public function getEtat(): ?int
    {
        return $this->etat;
    }

    public function setEtat(int $etat): static
    {
        $this->etat = $etat;

        return $this;
    }

    public function getRemarque(): ?string
    {
        return $this->remarque;
    }

    public function setRemarque(?string $remarque): static
    {
        $this->remarque = $remarque;

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

    public function getTypePanier(): ?TypePanier
    {
        return $this->type_panier;
    }

    public function setTypePanier(?TypePanier $type_panier): static
    {
        $this->type_panier = $type_panier;

        return $this;
    }

    public function getTypeSol(): ?TypeSol
    {
        return $this->type_sol;
    }

    public function setTypeSol(?TypeSol $type_sol): static
    {
        $this->type_sol = $type_sol;

        return $this;
    }

    public function getVoteValide(): ?int
    {
        return $this->Vote_valide;
    }

    public function setVoteValide(?int $Vote_valide): static
    {
        $this->Vote_valide = $Vote_valide;

        return $this;
    }

    public function getVoteRefuse(): ?int
    {
        return $this->Vote_refuse;
    }

    public function setVoteRefuse(?int $Vote_refuse): static
    {
        $this->Vote_refuse = $Vote_refuse;

        return $this;
    }

    /**
     * @return Collection<int, Vote>
     */
    public function getVotes(): Collection
    {
        return $this->votes;
    }

    public function addVote(Vote $vote): static
    {
        if (!$this->votes->contains($vote)) {
            $this->votes->add($vote);
            $vote->setTerrain($this);
        }

        return $this;
    }

    public function removeVote(Vote $vote): static
    {
        if ($this->votes->removeElement($vote)) {
            // set the owning side to null (unless already changed)
            if ($vote->getTerrain() === $this) {
                $vote->setTerrain(null);
            }
        }

        return $this;
    }

    public function getEtatDelete(): ?int
    {
        return $this->etat_delete;
    }

    public function setEtatDelete(?int $etat_delete): static
    {
        $this->etat_delete = $etat_delete;

        return $this;
    }
}
