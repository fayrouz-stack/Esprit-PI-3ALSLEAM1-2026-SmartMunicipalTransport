package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.AppUser;
import municipal_transport_backend.alternate.smartbus.entity.Chauffeur;
import municipal_transport_backend.alternate.smartbus.repository.AppUserRepository;
import municipal_transport_backend.alternate.smartbus.repository.ChauffeurRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChauffeurService {

  @Autowired private ChauffeurRepository repository;
  @Autowired private AppUserRepository   userRepository;
  @Autowired private PasswordUtils       passwordUtils;

  public List<Chauffeur> findAll() {
    return repository.findAll();
  }

  public Chauffeur findById(Long id) {
    return repository.findById(id).orElse(null);
  }

  public Chauffeur save(Chauffeur chauffeur) {
    boolean isNew = (chauffeur.getId() == null);

    if (!isNew) {
      // ── Mise à jour : synchroniser l'AppUser si l'email a changé ─────────
      Chauffeur existing = repository.findById(chauffeur.getId()).orElse(null);
      Chauffeur saved    = repository.save(chauffeur);

      if (existing != null && existing.getEmail() != null) {
        userRepository.findByEmail(existing.getEmail()).ifPresent(u -> {
          u.setEmail(saved.getEmail() != null ? saved.getEmail() : u.getEmail());
          u.setNom(saved.getNom());
          u.setPrenom(saved.getPrenom());
          userRepository.save(u);
        });
      }
      return saved;
    }

    // ── Création : 1) save pour générer l'ID, 2) set matricule, 3) re-save ──
    Chauffeur saved = repository.save(chauffeur);
    saved.setMatricule("BUS-" + saved.getId());
    saved = repository.save(saved);

    // ── Création du compte AppUser correspondant ──────────────────────────
    // Mot de passe initial = matricule (ex: BUS-5)
    // Le chauffeur peut le changer depuis son profil
    if (saved.getEmail() != null && !saved.getEmail().isBlank()
            && userRepository.findByEmail(saved.getEmail()).isEmpty()) {

      AppUser user = new AppUser();
      user.setEmail(saved.getEmail());
      user.setPassword(passwordUtils.encode(saved.getMatricule()));
      user.setRole("CHAUFFEUR");
      user.setNom(saved.getNom());
      user.setPrenom(saved.getPrenom());
      userRepository.save(user);
    }

    return saved;
  }

  public void delete(Long id) {
    // Supprimer l'AppUser lié avant de supprimer le chauffeur
    Chauffeur c = repository.findById(id).orElse(null);
    if (c != null && c.getEmail() != null) {
      userRepository.findByEmail(c.getEmail()).ifPresent(userRepository::delete);
    }
    repository.deleteById(id);
  }
}
