package municipal_transport_backend.alternate.smartbus.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ligne")
@Data
public class Ligne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String numero;
    private String destination;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "ligne_station",
        joinColumns = @JoinColumn(name = "ligne_id"),
        inverseJoinColumns = @JoinColumn(name = "station_id")
    )
    private List<Station> stations = new ArrayList<>();
}
