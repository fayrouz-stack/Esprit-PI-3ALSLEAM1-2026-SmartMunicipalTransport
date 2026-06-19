package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.AlertIncident;
import municipal_transport_backend.alternate.smartbus.repository.AlertIncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertIncidentService {

    @Autowired
    private AlertIncidentRepository repository;

    public AlertIncident create(AlertIncident incident) {
        incident.setCreatedAt(LocalDateTime.now());
        if (incident.getActive() == null) {
            incident.setActive(true);
        }
        return repository.save(incident);
    }

    public List<AlertIncident> getActiveAlerts() {
        return repository.findByActiveTrueOrderByCreatedAtDesc();
    }
}
