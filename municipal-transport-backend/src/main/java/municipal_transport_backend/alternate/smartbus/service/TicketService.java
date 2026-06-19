package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Ticket;
import municipal_transport_backend.alternate.smartbus.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    @Autowired
    private TicketRepository repository;

    public List<Ticket> findAll() {
        return repository.findAll();
    }

    public Ticket findById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public Ticket save(Ticket ticket) {
        // Create
        if (ticket.getId() == null) {
            if (ticket.getNumero() == null || ticket.getNumero().isBlank()) {
                ticket.setNumero("TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            }
            if (ticket.getDateCreation() == null) {
                ticket.setDateCreation(LocalDateTime.now());
            }
            if (ticket.getStatut() == null || ticket.getStatut().isBlank()) {
                ticket.setStatut("PAYE");
            }
        }
        return repository.save(ticket);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public Ticket update(Integer id, Ticket ticket) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Ticket non trouvé avec l'id: " + id);
        }
        ticket.setId(id);
        return repository.save(ticket);
    }

    // Métier — stats utilisées par le dashboard et le chatbot
    public long countAll() {
        return repository.count();
    }

    public double sumRevenue() {
        return repository.findAll().stream()
                .filter(t -> "PAYE".equalsIgnoreCase(t.getStatut()))
                .mapToDouble(t -> t.getMontantTotal() == null ? 0.0 : t.getMontantTotal())
                .sum();
    }

    public long countToday() {
        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        return repository.findAll().stream()
                .filter(t -> t.getDateCreation() != null && t.getDateCreation().isAfter(start))
                .count();
    }
}
