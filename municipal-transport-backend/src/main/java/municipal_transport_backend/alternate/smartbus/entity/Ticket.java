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

    @Column(name = "voyage_id")
    private Integer voyageId;         // معرف الرحلة

    @Column(name = "nombre_billets")
    private Integer nombreBillets;    // عدد التذاكر

    @Column(name = "montant_total")
    private Double montantTotal;      // المبلغ الإجمالي

    @Column(name = "methode_paiement")
    private String methodePaiement;   // Stripe, PayPal, Espèces...

    @Column(name = "passager_nom")
    private String passagerNom;       // اسم المسافر

    @Column(name = "passager_email")
    private String passagerEmail;     // بريد المسافر (اختياري)

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    private String statut;            // PAYE, ANNULE, etc.
}
