package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.entity.Horaire;
import municipal_transport_backend.alternate.smartbus.service.HoraireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horaires")
public class HoraireController {

    @Autowired
    private HoraireService horaireService;

    @GetMapping
    public List<Horaire> getAll() {
        return horaireService.findAll();
    }

    @GetMapping("/all")
    public List<Horaire> getAllUnpaged() {
        return horaireService.findAll();
    }

    @GetMapping("/{id}")
    public Horaire getById(@PathVariable Integer id) {
        return horaireService.findById(id);
    }

    @PostMapping
    public Horaire create(@RequestBody Horaire horaire) {
        return horaireService.save(horaire);
    }

    @PutMapping("/{id}")
    public Horaire update(@PathVariable Integer id, @RequestBody Horaire horaire) {
        return horaireService.update(id, horaire);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        horaireService.delete(id);
    }
}