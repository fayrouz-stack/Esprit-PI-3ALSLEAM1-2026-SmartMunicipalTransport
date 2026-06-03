package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Station;
import municipal_transport_backend.alternate.smartbus.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationService {

    @Autowired
    private StationRepository repository;

    public List<Station> findAll() {
        return repository.findAll();
    }

    public Station findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station non trouvée"));
    }

    public Station save(Station station) {
        return repository.save(station);
    }

    public Station update(Integer id, Station station) {
        station.setId(id);
        return repository.save(station);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
