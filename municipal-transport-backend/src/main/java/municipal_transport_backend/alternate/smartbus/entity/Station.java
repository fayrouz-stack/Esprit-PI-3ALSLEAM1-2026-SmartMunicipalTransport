package municipal_transport_backend.alternate.smartbus.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "station")
@Data
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nom;
    private String adresse;
    private String ville;
}
