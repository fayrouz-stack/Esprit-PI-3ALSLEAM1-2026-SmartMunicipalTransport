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
