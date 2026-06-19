package municipal_transport_backend.alternate.smartbus.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "affectation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Affectation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long chauffeurId;
    private Long vehiculeId;
    private Long ligneId;

    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;

    private String statut;       // PLANIFIEE, EN_COURS, TERMINEE, ANNULEE
    private String remarque;

    private LocalDateTime dateCreation;

    @PrePersist
    public void prePersist() {
        if (dateCreation == null) dateCreation = LocalDateTime.now();
        if (statut == null || statut.isBlank()) statut = "PLANIFIEE";
    }
}
