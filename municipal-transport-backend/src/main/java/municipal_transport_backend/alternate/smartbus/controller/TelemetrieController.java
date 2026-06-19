package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.entity.Telemetrie;
import municipal_transport_backend.alternate.smartbus.service.TelemetrieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Endpoints de télémétrie cabin-monitor (ESP32 + DHT22 + MQ-2).
 *
 * POST  /api/telemetrie          → enregistrer une mesure
 * GET   /api/telemetrie/{vid}/latest  → dernière mesure d'un véhicule
 * GET   /api/telemetrie/{vid}/history → 50 dernières mesures
 * GET   /api/telemetrie/alertes        → toutes les alertes actives
 */
@RestController
@RequestMapping("/api/telemetrie")
public class TelemetrieController {

    @Autowired
    private TelemetrieService service;

    /**
     * Reçoit une mesure depuis l'ESP32.
     * Body attendu :
     * {
     *   "vehiculeId": 3,
     *   "temperature": 28.4,
     *   "humidite": 55.2,
     *   "niveauGaz": 320
     * }
     */
    @PostMapping
    public ResponseEntity<?> enregistrer(@RequestBody Telemetrie t) {
        if (t.getVehiculeId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "vehiculeId obligatoire"));
        }
        Telemetrie saved = service.enregistrer(t);

        // Réponse enrichie pour que l'ESP32 puisse allumer le buzzer si alerte
        return ResponseEntity.ok(Map.of(
                "id",          saved.getId(),
                "alerte",      Boolean.TRUE.equals(saved.getAlerte()),
                "typeAlerte",  saved.getTypeAlerte() != null ? saved.getTypeAlerte() : "",
                "dateMesure",  saved.getDateMesure().toString()
        ));
    }

    /** Dernière mesure d'un véhicule */
    @GetMapping("/{vehiculeId}/latest")
    public ResponseEntity<?> latest(@PathVariable Long vehiculeId) {
        return service.derniereMesure(vehiculeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Historique des 50 dernières mesures d'un véhicule */
    @GetMapping("/{vehiculeId}/history")
    public List<Telemetrie> history(@PathVariable Long vehiculeId) {
        return service.historique(vehiculeId);
    }

    /** Toutes les alertes actives (pour le dashboard) */
    @GetMapping("/alertes")
    public List<Telemetrie> alertes() {
        return service.alertesActives();
    }
}
