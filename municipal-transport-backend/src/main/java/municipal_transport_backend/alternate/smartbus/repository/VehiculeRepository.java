<<<<<<< HEAD
package municipal_transport_backend.alternate.smartbus.repository;

import municipal_transport_backend.alternate.smartbus.entity.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    
    // Recherche par état (ex: "bon état", "neuf", "en panne")
    List<Vehicule> findByEtat(String etat);
    
    // Recherche par type de véhicule (ex: "Bus", "Minibus", "Camion")
    List<Vehicule> findByTypeVehicule(String typeVehicule);
    
    // Recherche des véhicules disponibles
    List<Vehicule> findByVehiculeDispoTrue();
    
    // Recherche par marque (contient)
    List<Vehicule> findByMarqueContainingIgnoreCase(String marque);
    
    // Recherche par matricule (exact)
    Vehicule findByMatriculeFourni(String matriculeFourni);
=======
package municipal_transport_backend.alternate.smartbus.repository;

import municipal_transport_backend.alternate.smartbus.entity.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    
    // Recherche par état (ex: "bon état", "neuf", "en panne")
    List<Vehicule> findByEtat(String etat);
    
    // Recherche par type de véhicule (ex: "Bus", "Minibus", "Camion")
    List<Vehicule> findByTypeVehicule(String typeVehicule);
    
    // Recherche des véhicules disponibles
    List<Vehicule> findByVehiculeDispoTrue();
    
    // Recherche par marque (contient)
    List<Vehicule> findByMarqueContainingIgnoreCase(String marque);
    
    // Recherche par matricule (exact)
    Vehicule findByMatriculeFourni(String matriculeFourni);
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}