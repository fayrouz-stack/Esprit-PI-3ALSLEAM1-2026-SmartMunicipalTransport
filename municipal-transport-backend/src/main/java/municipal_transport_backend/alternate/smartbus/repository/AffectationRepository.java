package municipal_transport_backend.alternate.smartbus.repository;

import municipal_transport_backend.alternate.smartbus.entity.Affectation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AffectationRepository extends JpaRepository<Affectation, Long> {

    // Conflit chauffeur : même chauffeur sur une plage qui chevauche
    @Query("SELECT a FROM Affectation a WHERE a.chauffeurId = :chauffeurId " +
           "AND a.statut <> 'ANNULEE' " +
           "AND (:excludeId IS NULL OR a.id <> :excludeId) " +
           "AND a.dateDebut < :fin AND a.dateFin > :debut")
    List<Affectation> findChauffeurConflits(
            @Param("chauffeurId") Long chauffeurId,
            @Param("debut") LocalDateTime debut,
            @Param("fin") LocalDateTime fin,
            @Param("excludeId") Long excludeId
    );

    // Conflit véhicule
    @Query("SELECT a FROM Affectation a WHERE a.vehiculeId = :vehiculeId " +
           "AND a.statut <> 'ANNULEE' " +
           "AND (:excludeId IS NULL OR a.id <> :excludeId) " +
           "AND a.dateDebut < :fin AND a.dateFin > :debut")
    List<Affectation> findVehiculeConflits(
            @Param("vehiculeId") Long vehiculeId,
            @Param("debut") LocalDateTime debut,
            @Param("fin") LocalDateTime fin,
            @Param("excludeId") Long excludeId
    );

    // Planning sur une plage
    List<Affectation> findByDateDebutBetweenOrderByDateDebutAsc(LocalDateTime debut, LocalDateTime fin);
}
