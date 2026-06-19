package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.entity.Ticket;
import municipal_transport_backend.alternate.smartbus.entity.Voyage;
import municipal_transport_backend.alternate.smartbus.service.TicketService;
import municipal_transport_backend.alternate.smartbus.repository.VoyageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService service;

    @Autowired
    private VoyageRepository voyageRepo;

    @GetMapping
    public List<Ticket> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Ticket getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    public Ticket create(@RequestBody Ticket t) {
        t.setId(null);
        return service.save(t);
    }

    @PutMapping("/{id}")
    public Ticket update(@PathVariable Integer id, @RequestBody Ticket t) {
        return service.update(id, t);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    // Endpoint stats utilisé par le dashboard
    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return Map.of(
                "totalTickets", service.countAll(),
                "revenuTotal", service.sumRevenue(),
                "ticketsAujourdhui", service.countToday()
        );
    }

    /**
     * Validation ticket par dispositif embarqué (ESP32 Wokwi ou lecteur NFC réel).
     * POST /api/tickets/validate
     * Body : { "ticketId": 1 }
     * Retours :
     *   200 → ticket valide, marqué UTILISE
     *   400 → ticket déjà utilisé / annulé / non payé
     *   404 → ticket introuvable
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody Map<String, Object> body) {
        Object raw = body.get("ticketId");
        if (raw == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "ticketId manquant"));
        }
        int ticketId = ((Number) raw).intValue();

        Ticket ticket = service.findById(ticketId);
        if (ticket == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Ticket introuvable (ID " + ticketId + ")"));
        }
        if ("UTILISE".equalsIgnoreCase(ticket.getStatut())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Ticket deja utilise", "passagerNom", ticket.getPassagerNom()));
        }
        if ("ANNULE".equalsIgnoreCase(ticket.getStatut())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Ticket annule"));
        }
        if (!"PAYE".equalsIgnoreCase(ticket.getStatut())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Ticket non paye (statut: " + ticket.getStatut() + ")"));
        }

        // Marquer comme utilisé
        ticket.setStatut("UTILISE");
        service.save(ticket);

        // Récupérer destination du voyage pour l'affichage LCD
        String dest = "";
        if (ticket.getVoyageId() != null) {
            dest = voyageRepo.findById(ticket.getVoyageId())
                    .map(v -> v.getLigne() != null ? v.getLigne().getDestination() : "")
                    .orElse("");
        }

        return ResponseEntity.ok(Map.of(
                "message",     "Ticket valide",
                "ticketId",    ticketId,
                "passagerNom", ticket.getPassagerNom() != null ? ticket.getPassagerNom() : "",
                "voyageDest",  dest,
                "statut",      "UTILISE"
        ));
    }
}
