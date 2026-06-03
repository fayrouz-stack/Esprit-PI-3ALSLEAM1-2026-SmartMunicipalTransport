package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Telemetrie;
import municipal_transport_backend.alternate.smartbus.repository.TelemetrieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TelemetrieService {

    // ── Seuils d'alerte ─────────────────────────────────────────────────────
    private static final double TEMP_MAX      = 35.0;   // °C
    private static final double TEMP_MIN      = 5.0;    // °C
    private static final int    GAZ_SEUIL     = 1500;   // unités ADC (0-4095)
    private static final double HUMIDITE_MAX  = 85.0;   // %

    @Autowired
    private TelemetrieRepository repository;

    /**
     * Enregistre une mesure, calcule les alertes et retourne l'objet persisté.
     */
    public Telemetrie enregistrer(Telemetrie t) {
        t.setDateMesure(LocalDateTime.now());

        // Détection d'alerte
        String typeAlerte = detecterAlerte(t);
        t.setAlerte(typeAlerte != null);
        t.setTypeAlerte(typeAlerte);

        return repository.save(t);
    }

    public Optional<Telemetrie> derniereMesure(Long vehiculeId) {
        return repository.findTopByVehiculeIdOrderByDateMesureDesc(vehiculeId);
    }

    public List<Telemetrie> historique(Long vehiculeId) {
        return repository.findTop50ByVehiculeIdOrderByDateMesureDesc(vehiculeId);
    }

    public List<Telemetrie> alertesActives() {
        return repository.findByAlerteTrue();
    }

    // ── Logique de détection ─────────────────────────────────────────────────
    private String detecterAlerte(Telemetrie t) {
        if (t.getNiveauGaz() != null && t.getNiveauGaz() >= GAZ_SEUIL) {
            return "GAZ_DETECTE";
        }
        if (t.getTemperature() != null && t.getTemperature() > TEMP_MAX) {
            return "TEMPERATURE_ELEVEE";
        }
        if (t.getTemperature() != null && t.getTemperature() < TEMP_MIN) {
            return "TEMPERATURE_BASSE";
        }
        if (t.getHumidite() != null && t.getHumidite() > HUMIDITE_MAX) {
            return "HUMIDITE_ELEVEE";
        }
        return null;
    }
}
