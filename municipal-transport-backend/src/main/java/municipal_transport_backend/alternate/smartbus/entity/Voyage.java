<<<<<<< HEAD
package municipal_transport_backend.alternate.smartbus.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "voyage")
@Data
public class Voyage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "date_voyage")
    private LocalDate dateVoyage;

    @Column(name = "nombre_places_disponible")
    private Integer nombrePlacesDisponible;

    private double prix;

    @ManyToOne
    @JoinColumn(name = "ligne_id")
    private Ligne ligne;

    @ManyToOne
    @JoinColumn(name = "horaire_id")
    private Horaire horaire;

    @ManyToOne
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehicule;

    @ManyToOne
    @JoinColumn(name = "matricule_cond", referencedColumnName = "matricule")
    private Chauffeur chauffeur;
}

=======
package municipal_transport_backend.alternate.smartbus.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "voyage")
@Data
public class Voyage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "dateVoyage")
    private LocalDate dateVoyage;

    @Column(name = "nombrePlacesDisponible")
    private Integer nombrePlacesDisponible;

    private double prix;

    @ManyToOne
    @JoinColumn(name = "ligne_id")
    private Ligne ligne;

    @ManyToOne
    @JoinColumn(name = "horaire_id")
    private Horaire horaire;

    @ManyToOne
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehicule;

    @ManyToOne
    @JoinColumn(name = "matriculeCond", referencedColumnName = "matricule")
    private Chauffeur chauffeur;
}

>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
