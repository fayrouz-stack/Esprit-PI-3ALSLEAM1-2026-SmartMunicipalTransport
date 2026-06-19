package municipal_transport_backend.alternate.smartbus.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Utilisateur de l'application.
 * Roles : ADMIN | GESTIONNAIRE | CHAUFFEUR
 */
@Entity
@Table(name = "app_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // BCrypt hash

    @Column(nullable = false)
    private String role;     // ADMIN | GESTIONNAIRE | CHAUFFEUR

    private String nom;
    private String prenom;
}
