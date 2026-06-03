package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Ligne;
import municipal_transport_backend.alternate.smartbus.repository.LigneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LigneService {

    @Autowired
    private LigneRepository repository;

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
}
