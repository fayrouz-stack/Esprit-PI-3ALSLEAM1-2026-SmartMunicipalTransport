package municipal_transport_backend.alternate.smartbus.repository;

import municipal_transport_backend.alternate.smartbus.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
}