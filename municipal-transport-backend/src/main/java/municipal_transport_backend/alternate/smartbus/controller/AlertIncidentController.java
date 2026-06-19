package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.entity.AlertIncident;
import municipal_transport_backend.alternate.smartbus.service.AlertIncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alertes")
public class AlertIncidentController {

    @Autowired
    private AlertIncidentService service;

    @PostMapping("/camera")
    public ResponseEntity<?> reportCameraAlert(@RequestBody CameraAlertPayload payload) {
        if (payload.voyageId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "voyageId obligatoire"));
        }
        if (payload.type == null || payload.type.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "type obligatoire"));
        }
        if (payload.summary == null || payload.summary.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "summary obligatoire"));
        }

        AlertIncident incident = new AlertIncident();
        incident.setVoyageId(payload.voyageId);
        incident.setType(payload.type);
        incident.setSummary(payload.summary);
        incident.setImageData(payload.imageData);
        incident.setActive(true);

        AlertIncident saved = service.create(incident);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<AlertIncident> getActiveAlerts() {
        return service.getActiveAlerts();
    }

    public static class CameraAlertPayload {
        public Long voyageId;
        public String type;
        public String summary;
        public String imageData;
    }
}
