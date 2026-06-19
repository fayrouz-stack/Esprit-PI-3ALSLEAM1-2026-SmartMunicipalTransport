package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.entity.Affectation;
import municipal_transport_backend.alternate.smartbus.service.AffectationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/affectations")
public class AffectationController {

    @Autowired
    private AffectationService service;

    @GetMapping
    public List<Affectation> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Affectation getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Affectation a) {
        try {
            a.setId(null);
            return ResponseEntity.ok(service.save(a));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Affectation a) {
        try {
            a.setId(id);
            return ResponseEntity.ok(service.save(a));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/planning")
    public List<Affectation> planning(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return service.getPlanning(debut, fin);
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return Map.of(
                "totalAffectations", service.countAll(),
                "affectationsActives", service.countActives()
        );
    }
<<<<<<< HEAD

    /**
     * Auto-affectation : sélectionne automatiquement le premier chauffeur
     * et véhicule disponibles, crée et persiste l'affectation.
     *
     * Body : { "ligneId": 1, "dateDebut": "2026-06-05T08:00:00", "dateFin": "2026-06-05T16:00:00" }
     * 200 → affectation créée
     * 400 → aucune ressource disponible / données invalides
     */
    @PostMapping("/auto")
    public ResponseEntity<?> autoAssign(@RequestBody Map<String, Object> body) {
        try {
            Long ligneId  = ((Number) body.get("ligneId")).longValue();
            LocalDateTime debut = LocalDateTime.parse((String) body.get("dateDebut"));
            LocalDateTime fin   = LocalDateTime.parse((String) body.get("dateFin"));
            Affectation result  = service.autoAssign(ligneId, debut, fin);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Requête invalide : " + e.getMessage()));
        }
    }
=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}
