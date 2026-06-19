package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.entity.Horaire;
import municipal_transport_backend.alternate.smartbus.entity.Ligne;
import municipal_transport_backend.alternate.smartbus.entity.Station;
import municipal_transport_backend.alternate.smartbus.service.HoraireService;
import municipal_transport_backend.alternate.smartbus.service.LigneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lignes")
public class LigneController {

    @Autowired
    private LigneService ligneService;

    @Autowired
    private HoraireService horaireService;

    @GetMapping
    public List<Ligne> getAll() {
        return ligneService.findAll();
    }

    @GetMapping("/all")
    public List<Ligne> getAllUnpaged() {
        return ligneService.findAll();
    }

    @GetMapping("/{id}")
    public Ligne getById(@PathVariable Integer id) {
        return ligneService.findById(id);
    }

    @GetMapping("/{id}/stations")
    public List<Station> getStations(@PathVariable Integer id) {
        return ligneService.getStations(id);
    }

    @PostMapping("/{id}/stations/{stationId}")
    public Ligne addStation(@PathVariable Integer id, @PathVariable Integer stationId) {
        return ligneService.addStation(id, stationId);
    }

    @DeleteMapping("/{id}/stations/{stationId}")
    public Ligne removeStation(@PathVariable Integer id, @PathVariable Integer stationId) {
        return ligneService.removeStation(id, stationId);
    }

    @GetMapping("/{id}/horaires")
    public List<Horaire> getHoraires(@PathVariable Integer id) {
        return horaireService.findByLigneId(id);
    }

    @PostMapping
    public Ligne create(@RequestBody Ligne ligne) {
        return ligneService.save(ligne);
    }

    @PutMapping("/{id}")
    public Ligne update(@PathVariable Integer id, @RequestBody Ligne ligne) {
        return ligneService.update(id, ligne);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        ligneService.delete(id);
    }
}