package municipal_transport_backend.alternate.smartbus.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Historique des positions GPS d'un véhicule.
 * Table créée automatiquement par Hibernate (ddl-auto=update).
 */
@Entity
@Table(name = "position_history")
public class PositionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicule_id", nullable = false)
    private Long vehiculeId;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    public PositionHistory() {}

    public PositionHistory(Long vehiculeId, Double latitude, Double longitude) {
        this.vehiculeId  = vehiculeId;
        this.latitude    = latitude;
        this.longitude   = longitude;
        this.recordedAt  = LocalDateTime.now();
    }

    public Long getId()                  { return id; }
    public Long getVehiculeId()          { return vehiculeId; }
    public Double getLatitude()          { return latitude; }
    public Double getLongitude()         { return longitude; }
    public LocalDateTime getRecordedAt() { return recordedAt; }

    public void setId(Long id)                          { this.id = id; }
    public void setVehiculeId(Long vehiculeId)          { this.vehiculeId = vehiculeId; }
    public void setLatitude(Double latitude)            { this.latitude = latitude; }
    public void setLongitude(Double longitude)          { this.longitude = longitude; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
