package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Vehicule;
import municipal_transport_backend.alternate.smartbus.repository.VehiculeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehiculeService {

    @Autowired
    private VehiculeRepository repository;

    public List<Vehicule> findAll() {
        return repository.findAll();
    }

    public Vehicule findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));
    }

    public Vehicule save(Vehicule vehicule) {
        return repository.save(vehicule);
    }

    public Vehicule update(Long id, Vehicule details) {
        Vehicule vehicule = findById(id);
        vehicule.setMarque(details.getMarque());
        vehicule.setModele(details.getModele());
        vehicule.setTypeVehicule(details.getTypeVehicule());
        vehicule.setEtat(details.getEtat());
        vehicule.setVehiculeDispo(details.isVehiculeDispo());
        vehicule.setMatriculeFourni(details.getMatriculeFourni());
        vehicule.setLocalisation(details.getLocalisation());
        vehicule.setKilometrage(details.getKilometrage());
        vehicule.setCarburant(details.getCarburant());
        vehicule.setDateFinAssurance(details.getDateFinAssurance());
        vehicule.setDateProchainCt(details.getDateProchainCt());
        vehicule.setDatePremiereMiseCirculation(details.getDatePremiereMiseCirculation());
        vehicule.setDateValiditeExploitation(details.getDateValiditeExploitation());
        vehicule.setLatitude(details.getLatitude());
        vehicule.setLongitude(details.getLongitude());
        return repository.save(vehicule);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Vehicule> findByEtat(String etat) {
        return repository.findByEtat(etat);
    }

    public List<Vehicule> findDisponibles() {
        return repository.findByVehiculeDispoTrue();
    }

    public List<Vehicule> findByTypeVehicule(String type) {
        return repository.findByTypeVehicule(type);
    }

    public Vehicule findByMatriculeFourni(String matricule) {
        return repository.findByMatriculeFourni(matricule);
    }
}
