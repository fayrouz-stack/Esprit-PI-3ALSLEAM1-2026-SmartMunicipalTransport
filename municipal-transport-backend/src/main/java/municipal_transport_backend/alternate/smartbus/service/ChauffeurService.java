package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Chauffeur;
import municipal_transport_backend.alternate.smartbus.repository.ChauffeurRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChauffeurService {

  @Autowired
  private ChauffeurRepository repository;

  public List<Chauffeur> findAll() {
    return repository.findAll();
  }

  public Chauffeur findById(Long id) {
    return repository.findById(id).orElse(null);
  }

  public Chauffeur save(Chauffeur chauffeur) {
    if (chauffeur.getId() != null) {
      // Update: preserve existing matricule
      return repository.save(chauffeur);
    }
    // Create: first save to generate ID, then set matricule
    Chauffeur saved = repository.save(chauffeur);
    saved.setMatricule("BUS-" + saved.getId());
    return repository.save(saved);
  }

  public void delete(Long id) {
    repository.deleteById(id);
  }
}