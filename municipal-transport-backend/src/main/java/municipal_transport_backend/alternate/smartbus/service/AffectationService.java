package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Affectation;
import municipal_transport_backend.alternate.smartbus.entity.Chauffeur;
import municipal_transport_backend.alternate.smartbus.entity.Vehicule;
import municipal_transport_backend.alternate.smartbus.repository.AffectationRepository;
import municipal_transport_backend.alternate.smartbus.repository.ChauffeurRepository;
import municipal_transport_backend.alternate.smartbus.repository.LigneRepository;
import municipal_transport_backend.alternate.smartbus.repository.VehiculeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AffectationService {

    @Autowired private AffectationRepository repo;
    @Autowired private ChauffeurRepository chauffeurRepo;
    @Autowired private VehiculeRepository vehiculeRepo;
    @Autowired private LigneRepository ligneRepo;

    public List<Affectation> findAll() {
        return repo.findAll();
    }

    public Affectation findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public List<Affectation> getPlanning(LocalDateTime debut, LocalDateTime fin) {
        return repo.findByDateDebutBetweenOrderByDateDebutAsc(debut, fin);
    }

    /**
     * Règles métier :
     * 1) chauffeur, véhicule et ligne doivent exister
     * 2) dateFin > dateDebut
     * 3) pas de conflit horaire chauffeur
     * 4) pas de conflit horaire véhicule
     * 5) véhicule doit être disponible (vehiculeDispo == true)
     */
    public Affectation save(Affectation a) {
        // 1. existence
        if (a.getChauffeurId() == null || chauffeurRepo.findById(a.getChauffeurId()).isEmpty())
            throw new IllegalArgumentException("Chauffeur introuvable");
        if (a.getVehiculeId() == null || vehiculeRepo.findById(a.getVehiculeId()).isEmpty())
            throw new IllegalArgumentException("Véhicule introuvable");
        if (a.getLigneId() == null || ligneRepo.findById(a.getLigneId().intValue()).isEmpty())
            throw new IllegalArgumentException("Ligne introuvable");

        // 2. dates
        if (a.getDateDebut() == null || a.getDateFin() == null)
            throw new IllegalArgumentException("Dates de début et fin obligatoires");
        if (!a.getDateFin().isAfter(a.getDateDebut()))
            throw new IllegalArgumentException("La date de fin doit être après la date de début");

        // 5. véhicule disponible (uniquement pour les nouvelles affectations PLANIFIEE / EN_COURS)
        if (!"ANNULEE".equalsIgnoreCase(a.getStatut())) {
            Vehicule v = vehiculeRepo.findById(a.getVehiculeId()).orElse(null);
            if (v != null && !v.isVehiculeDispo()) {
                throw new IllegalArgumentException("Le véhicule sélectionné n'est pas disponible");
            }
        }

        // 3+4. conflits (chauffeur + véhicule)
        List<Affectation> conflitsCh = repo.findChauffeurConflits(
                a.getChauffeurId(), a.getDateDebut(), a.getDateFin(), a.getId());
        if (!conflitsCh.isEmpty())
            throw new IllegalArgumentException("Conflit : ce chauffeur est déjà affecté sur cette plage horaire");

        List<Affectation> conflitsVeh = repo.findVehiculeConflits(
                a.getVehiculeId(), a.getDateDebut(), a.getDateFin(), a.getId());
        if (!conflitsVeh.isEmpty())
            throw new IllegalArgumentException("Conflit : ce véhicule est déjà affecté sur cette plage horaire");

        return repo.save(a);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    // Stats pour dashboard / chatbot
    public long countAll() { return repo.count(); }

    public long countActives() {
        return repo.findAll().stream()
                .filter(a -> "EN_COURS".equalsIgnoreCase(a.getStatut())
                          || "PLANIFIEE".equalsIgnoreCase(a.getStatut()))
                .count();
    }

    /**
     * Auto-affectation : trouve le premier chauffeur et le premier véhicule
     * disponibles sur la plage [debut, fin] pour la ligne donnée,
     * crée l'affectation et la persiste.
     *
     * Règles :
     *  - Chauffeur : aucun conflit horaire existant (statut != ANNULEE)
     *  - Véhicule  : vehiculeDispo == true  ET  aucun conflit horaire
     */
    public Affectation autoAssign(Long ligneId, LocalDateTime debut, LocalDateTime fin) {
        if (ligneRepo.findById(ligneId.intValue()).isEmpty())
            throw new IllegalArgumentException("Ligne introuvable (id=" + ligneId + ")");
        if (debut == null || fin == null || !fin.isAfter(debut))
            throw new IllegalArgumentException("Plage horaire invalide");

        // ── Trouver un chauffeur libre ────────────────────────────────────
        Long chauffeurId = chauffeurRepo.findAll().stream()
                .filter(c -> repo.findChauffeurConflits(c.getId(), debut, fin, null).isEmpty())
                .map(Chauffeur::getId)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Aucun chauffeur disponible sur cette plage horaire"));

        // ── Trouver un véhicule libre et disponible ───────────────────────
        Long vehiculeId = vehiculeRepo.findAll().stream()
                .filter(v -> v.isVehiculeDispo()
                          && repo.findVehiculeConflits(v.getId(), debut, fin, null).isEmpty())
                .map(Vehicule::getId)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Aucun véhicule disponible sur cette plage horaire"));

        // ── Créer et persister l'affectation ─────────────────────────────
        Affectation a = new Affectation();
        a.setChauffeurId(chauffeurId);
        a.setVehiculeId(vehiculeId);
        a.setLigneId(ligneId);
        a.setDateDebut(debut);
        a.setDateFin(fin);
        a.setStatut("PLANIFIEE");
        a.setRemarque("Affectation automatique");
        return repo.save(a);
    }
}
