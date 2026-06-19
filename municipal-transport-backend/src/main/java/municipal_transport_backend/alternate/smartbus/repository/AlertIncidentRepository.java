package municipal_transport_backend.alternate.smartbus.repository;

import municipal_transport_backend.alternate.smartbus.entity.AlertIncident;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertIncidentRepository extends JpaRepository<AlertIncident, Long> {
    List<AlertIncident> findByActiveTrueOrderByCreatedAtDesc();
}
