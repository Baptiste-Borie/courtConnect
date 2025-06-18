<?php

namespace App\Entity;

use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: EventRepository::class)]
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['all_events'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['all_events'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['all_events'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['all_events'])]
    private ?\DateTimeImmutable $date_heure = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['all_events'])]
    private ?int $max_joueurs = null;

    #[ORM\Column(length: 255)]
    #[Groups(['all_events'])]
    private ?int $niveau = null;

    #[ORM\ManyToOne(inversedBy: 'events')]
    #[ORM\JoinColumn(name: 'created_by', referencedColumnName: 'id')]
    #[Groups(['all_events'])]
    private ?User $created_by = null;

    #[ORM\ManyToOne(inversedBy: 'events')]
    #[Groups(['all_events'])]
    private ?Terrain $terrain = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'events')]
    #[Groups(['userOfEvent'])]
    private Collection $joueurs;

    #[ORM\Column(length: 255)]
    #[Groups(['all_events'])]
    private ?int $etat = null;

    #[ORM\ManyToOne(inversedBy: 'events')]
    #[ORM\JoinColumn(name: 'type_event', referencedColumnName: 'id')]
    #[Groups(['all_events'])]
    private ?TypeEvent $type_event = null;

    public function __construct()
    {
        $this->joueurs = new ArrayCollection();
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDateHeure(): \DateTimeImmutable
    {
        return $this->date_heure;
    }

    public function setDateHeure(\DateTimeImmutable $date_heure): static
    {
        $this->date_heure = $date_heure;

        return $this;
    }

    public function getMaxJoueurs(): ?int
    {
        return $this->max_joueurs;
    }

    public function setMaxJoueurs(int $max_joueurs): static
    {
        $this->max_joueurs = $max_joueurs;

        return $this;
    }

    public function getNiveau(): ?int
    {
        return $this->niveau;
    }

    public function setNiveau(int $niveau): static
    {
        $this->niveau = $niveau;

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

    public function getTerrain(): ?Terrain
    {
        return $this->terrain;
    }

    public function setTerrain(?Terrain $terrain): static
    {
        $this->terrain = $terrain;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getJoueurs(): Collection
    {
        return $this->joueurs;
    }

    public function addJoueur(User $joueur): static
    {
        if (!$this->joueurs->contains($joueur)) {
            $this->joueurs->add($joueur);
        }

        return $this;
    }

    public function removeJoueur(User $joueur): static
    {
        $this->joueurs->removeElement($joueur);

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

    public function getTypeEvent(): ?TypeEvent
    {
        return $this->type_event;
    }

    public function setTypeEvent(?TypeEvent $type_event): static
    {
        $this->type_event = $type_event;

        return $this;
    }
}
