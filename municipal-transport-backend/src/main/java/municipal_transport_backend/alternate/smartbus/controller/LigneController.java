package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.entity.Ligne;
import municipal_transport_backend.alternate.smartbus.service.LigneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lignes")
public class LigneController {

    @Autowired
    private LigneService ligneService;

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