package municipal_transport_backend.alternate.smartbus.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "horaire")
@Data
public class Horaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDate date_voyage;
    private LocalTime horaire_depart;
    private LocalTime horaire_arrive;
    private Integer retard_estime; // بالدقائق
}
