package municipal_transport_backend.alternate.smartbus.repository;

import municipal_transport_backend.alternate.smartbus.entity.PositionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PositionHistoryRepository extends JpaRepository<PositionHistory, Long> {

    /** 50 dernières positions d'un véhicule, du plus récent au plus ancien. */
    List<PositionHistory> findTop50ByVehiculeIdOrderByRecordedAtDesc(Long vehiculeId);
}
