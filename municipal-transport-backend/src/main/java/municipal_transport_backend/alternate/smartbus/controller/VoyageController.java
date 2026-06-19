package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.entity.Voyage;
import municipal_transport_backend.alternate.smartbus.service.VoyageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voyages")
public class VoyageController {

    @Autowired private VoyageService voyageService;

    @GetMapping
    public List<Voyage> getAllVoyages() {
        return voyageService.getAllVoyages();
    }

    @GetMapping("/all")
    public List<Voyage> getAllVoyagesUnpaged() {
        return voyageService.getAllVoyages();
    }

    @GetMapping("/{id}")
    public Voyage getVoyageById(@PathVariable Integer id) {
        return voyageService.getVoyageById(id);
    }

    @PostMapping
    public Voyage createVoyage(@RequestBody Voyage voyage) {
        return voyageService.createVoyage(voyage);
    }

    @PutMapping("/{id}")
    public Voyage updateVoyage(@PathVariable Integer id, @RequestBody Voyage voyage) {
        return voyageService.updateVoyage(id, voyage);
    }

    @DeleteMapping("/{id}")
    public void deleteVoyage(@PathVariable Integer id) {
        voyageService.deleteVoyage(id);
    }
}