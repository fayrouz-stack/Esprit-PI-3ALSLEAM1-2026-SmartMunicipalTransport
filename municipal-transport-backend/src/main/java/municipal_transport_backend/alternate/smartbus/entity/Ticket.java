package municipal_transport_backend.alternate.smartbus.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket")
@Data
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String numero;            // رقم فريد للتذكرة
    private Integer voyageId;         // معرف الرحلة
    private Integer nombreBillets;    // عدد التذاكر
    private Double montantTotal;      // المبلغ الإجمالي
    private String methodePaiement;   // Stripe, PayPal, Espèces...
    private String passagerNom;       // اسم المسافر
    private String passagerEmail;     // بريد المسافر (اختياري)
    private LocalDateTime dateCreation;
    private String statut;            // PAYE, ANNULE, etc.
}
