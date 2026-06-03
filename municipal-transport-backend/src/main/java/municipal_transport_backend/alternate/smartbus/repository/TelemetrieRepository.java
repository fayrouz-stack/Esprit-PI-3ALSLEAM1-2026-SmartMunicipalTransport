package municipal_transport_backend.alternate.smartbus.repository;

import municipal_transport_backend.alternate.smartbus.entity.Telemetrie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TelemetrieRepository extends JpaRepository<Telemetrie, Long> {

    /** Dernière mesure d'un véhicule (tri par date desc, premier résultat) */
    Optional<Telemetrie> findTopByVehiculeIdOrderByDateMesureDesc(Long vehiculeId);

    /** Historique des 50 dernières mesures d'un véhicule */
    List<Telemetrie> findTop50ByVehiculeIdOrderByDateMesureDesc(Long vehiculeId);

    /** Toutes les alertes actives non acquittées */
    List<Telemetrie> findByAlerteTrue();
}
