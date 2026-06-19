package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.entity.Chauffeur;
import municipal_transport_backend.alternate.smartbus.service.ChauffeurService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chauffeurs")
public class ChauffeurController {

  @Autowired
  private ChauffeurService service;

  @GetMapping
  public List<Chauffeur> getAll() {
    return service.findAll();
  }

  // ✅ NOUVELLE ROUTE /all AJOUTÉE
  @GetMapping("/all")
  public List<Chauffeur> getAllUnpaged() {
    return service.findAll();
  }

  @GetMapping("/{id}")
  public Chauffeur getById(@PathVariable Long id) {
    return service.findById(id);
  }

  @PostMapping
  public Chauffeur create(@RequestBody Chauffeur c) {
    return service.save(c);
  }

  @PutMapping("/{id}")
  public Chauffeur update(
          @PathVariable Long id,
          @RequestBody Chauffeur c
  ) {
    c.setId(id);
    return service.save(c);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    service.delete(id);
  }
}