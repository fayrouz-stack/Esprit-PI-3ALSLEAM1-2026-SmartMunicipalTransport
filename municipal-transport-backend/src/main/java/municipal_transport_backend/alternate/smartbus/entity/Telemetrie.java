package municipal_transport_backend.alternate.smartbus.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Mesure capteur d'un véhicule : température cabine, humidité, niveau gaz/fumée.
 * Envoyée par le module ESP32 "cabin-monitor" embarqué dans le bus.
 */
@Entity
@Table(name = "telemetrie")
@Data
public class Telemetrie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicule_id", nullable = false)
    private Long vehiculeId;

    /** Température cabine (°C) — capteur DHT22 */
    private Double temperature;

    /** Humidité relative (%) — capteur DHT22 */
    private Double humidite;

    /** Niveau gaz/fumée en unités brutes ADC (0–4095) — capteur MQ-2 */
    private Integer niveauGaz;

    /** true si un seuil critique a été dépassé lors de cette mesure */
    private Boolean alerte;

    /** Description de l'alerte si active (ex: "TEMPERATURE_ELEVEE", "GAZ_DETECTE") */
    @Column(name = "type_alerte")
    private String typeAlerte;

    @Column(name = "date_mesure")
    private LocalDateTime dateMesure;
}
