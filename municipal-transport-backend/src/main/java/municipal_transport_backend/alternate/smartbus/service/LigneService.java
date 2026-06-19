package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Ligne;
<<<<<<< HEAD
import municipal_transport_backend.alternate.smartbus.entity.Station;
import municipal_transport_backend.alternate.smartbus.repository.LigneRepository;
import municipal_transport_backend.alternate.smartbus.repository.StationRepository;
=======
import municipal_transport_backend.alternate.smartbus.repository.LigneRepository;
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LigneService {

    @Autowired
    private LigneRepository repository;

<<<<<<< HEAD
    @Autowired
    private StationRepository stationRepository;

=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
    public List<Ligne> findAll() {
        return repository.findAll();
    }

    public Ligne findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ligne non trouvée"));
    }

    public Ligne save(Ligne ligne) {
        return repository.save(ligne);
    }

    public Ligne update(Integer id, Ligne ligne) {
        ligne.setId(id);
        return repository.save(ligne);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
<<<<<<< HEAD

    public List<Station> getStations(Integer ligneId) {
        return findById(ligneId).getStations();
    }

    public Ligne addStation(Integer ligneId, Integer stationId) {
        Ligne ligne = findById(ligneId);
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station non trouvée"));
        if (!ligne.getStations().contains(station)) {
            ligne.getStations().add(station);
            repository.save(ligne);
        }
        return ligne;
    }

    public Ligne removeStation(Integer ligneId, Integer stationId) {
        Ligne ligne = findById(ligneId);
        ligne.getStations().removeIf(s -> s.getId().equals(stationId));
        return repository.save(ligne);
    }
=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}
