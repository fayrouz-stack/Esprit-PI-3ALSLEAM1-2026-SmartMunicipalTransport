package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Horaire;
import municipal_transport_backend.alternate.smartbus.repository.HoraireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoraireService {

    @Autowired
    private HoraireRepository repository;

    public List<Horaire> findAll() {
        return repository.findAll();
    }

    public Horaire findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horaire non trouvé"));
    }

    public Horaire save(Horaire horaire) {
        return repository.save(horaire);
    }

    public Horaire update(Integer id, Horaire horaire) {
        horaire.setId(id);
        return repository.save(horaire);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
