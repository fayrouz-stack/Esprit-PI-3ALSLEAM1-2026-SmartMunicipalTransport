<<<<<<< HEAD
package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Chauffeur;
import municipal_transport_backend.alternate.smartbus.entity.Voyage;
import municipal_transport_backend.alternate.smartbus.repository.ChauffeurRepository;
import municipal_transport_backend.alternate.smartbus.repository.HoraireRepository;
import municipal_transport_backend.alternate.smartbus.repository.LigneRepository;
import municipal_transport_backend.alternate.smartbus.repository.VehiculeRepository;
import municipal_transport_backend.alternate.smartbus.repository.VoyageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoyageService {

    @Autowired private VoyageRepository voyageRepository;
    @Autowired private ChauffeurRepository chauffeurRepository;
    @Autowired private LigneRepository ligneRepository;
    @Autowired private HoraireRepository horaireRepository;
    @Autowired private VehiculeRepository vehiculeRepository;

    public List<Voyage> getAllVoyages() {
        return voyageRepository.findAll();
    }

    public Voyage getVoyageById(Integer id) {
        return voyageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voyage non trouvé avec l'id: " + id));
    }

    public Voyage createVoyage(Voyage voyage) {
        resolveRelations(voyage);
        return voyageRepository.save(voyage);
    }

    public Voyage updateVoyage(Integer id, Voyage voyage) {
        voyage.setId(id);
        resolveRelations(voyage);
        return voyageRepository.save(voyage);
    }

    public void deleteVoyage(Integer id) {
        voyageRepository.deleteById(id);
    }

    private void resolveRelations(Voyage voyage) {
        if (voyage.getLigne() != null && voyage.getLigne().getId() != null) {
            voyage.setLigne(ligneRepository.findById(voyage.getLigne().getId())
                .orElseThrow(() -> new RuntimeException("Ligne non trouvée")));
        }
        if (voyage.getHoraire() != null && voyage.getHoraire().getId() != null) {
            voyage.setHoraire(horaireRepository.findById(voyage.getHoraire().getId())
                .orElseThrow(() -> new RuntimeException("Horaire non trouvé")));
        }
        if (voyage.getVehicule() != null && voyage.getVehicule().getId() != null) {
            voyage.setVehicule(vehiculeRepository.findById(voyage.getVehicule().getId())
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé")));
        }
        if (voyage.getChauffeur() != null && voyage.getChauffeur().getMatricule() != null) {
            Chauffeur c = chauffeurRepository.findByMatricule(voyage.getChauffeur().getMatricule())
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé: " + voyage.getChauffeur().getMatricule()));
            voyage.setChauffeur(c);
        }
    }
=======
package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Chauffeur;
import municipal_transport_backend.alternate.smartbus.entity.Voyage;
import municipal_transport_backend.alternate.smartbus.repository.ChauffeurRepository;
import municipal_transport_backend.alternate.smartbus.repository.HoraireRepository;
import municipal_transport_backend.alternate.smartbus.repository.LigneRepository;
import municipal_transport_backend.alternate.smartbus.repository.VehiculeRepository;
import municipal_transport_backend.alternate.smartbus.repository.VoyageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoyageService {

    @Autowired private VoyageRepository voyageRepository;
    @Autowired private ChauffeurRepository chauffeurRepository;
    @Autowired private LigneRepository ligneRepository;
    @Autowired private HoraireRepository horaireRepository;
    @Autowired private VehiculeRepository vehiculeRepository;

    public List<Voyage> getAllVoyages() {
        return voyageRepository.findAll();
    }

    public Voyage getVoyageById(Integer id) {
        return voyageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voyage non trouvé avec l'id: " + id));
    }

    public Voyage createVoyage(Voyage voyage) {
        resolveRelations(voyage);
        return voyageRepository.save(voyage);
    }

    public Voyage updateVoyage(Integer id, Voyage voyage) {
        voyage.setId(id);
        resolveRelations(voyage);
        return voyageRepository.save(voyage);
    }

    public void deleteVoyage(Integer id) {
        voyageRepository.deleteById(id);
    }

    private void resolveRelations(Voyage voyage) {
        if (voyage.getLigne() != null && voyage.getLigne().getId() != null) {
            voyage.setLigne(ligneRepository.findById(voyage.getLigne().getId())
                .orElseThrow(() -> new RuntimeException("Ligne non trouvée")));
        }
        if (voyage.getHoraire() != null && voyage.getHoraire().getId() != null) {
            voyage.setHoraire(horaireRepository.findById(voyage.getHoraire().getId())
                .orElseThrow(() -> new RuntimeException("Horaire non trouvé")));
        }
        if (voyage.getVehicule() != null && voyage.getVehicule().getId() != null) {
            voyage.setVehicule(vehiculeRepository.findById(voyage.getVehicule().getId())
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé")));
        }
        if (voyage.getChauffeur() != null && voyage.getChauffeur().getMatricule() != null) {
            Chauffeur c = chauffeurRepository.findByMatricule(voyage.getChauffeur().getMatricule())
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé: " + voyage.getChauffeur().getMatricule()));
            voyage.setChauffeur(c);
        }
    }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}