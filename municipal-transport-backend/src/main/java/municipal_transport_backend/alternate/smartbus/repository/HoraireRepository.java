package municipal_transport_backend.alternate.smartbus.repository;

import municipal_transport_backend.alternate.smartbus.entity.Horaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoraireRepository extends JpaRepository<Horaire, Integer> {
    List<Horaire> findByLigneId(Integer ligneId);
}