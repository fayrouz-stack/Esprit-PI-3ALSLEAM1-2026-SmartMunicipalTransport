<<<<<<< HEAD
package municipal_transport_backend.alternate.smartbus.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    private Integer retard_estime;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ligne_id")
    @JsonIgnoreProperties({"stations", "hibernateLazyInitializer"})
    private Ligne ligne;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "station_depart_id")
    private Station stationDepart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "station_arrivee_id")
    private Station stationArrivee;
}
=======
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
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
