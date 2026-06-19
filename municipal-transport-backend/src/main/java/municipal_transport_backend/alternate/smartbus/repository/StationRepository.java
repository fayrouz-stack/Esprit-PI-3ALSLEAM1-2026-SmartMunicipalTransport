package municipal_transport_backend.alternate.smartbus.repository;

import municipal_transport_backend.alternate.smartbus.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository extends JpaRepository<Station, Integer> {}
