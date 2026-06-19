<<<<<<< HEAD
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
=======
package municipal_transport_backend.alternate.smartbus.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ligne")
@Data
public class Ligne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String numero;      // رقم الخط (مثلاً "101")
    private String destination; // الوجهة (مثلاً "Tunis - Sousse")
}
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
