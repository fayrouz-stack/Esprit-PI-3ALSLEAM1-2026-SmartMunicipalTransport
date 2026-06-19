<<<<<<< HEAD
package municipal_transport_backend.alternate.smartbus.repository;

import municipal_transport_backend.alternate.smartbus.entity.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {
    Optional<Chauffeur> findByMatricule(String matricule);
}
=======
package municipal_transport_backend.alternate.smartbus.repository;

import municipal_transport_backend.alternate.smartbus.entity.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {
    Optional<Chauffeur> findByMatricule(String matricule);
}
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
