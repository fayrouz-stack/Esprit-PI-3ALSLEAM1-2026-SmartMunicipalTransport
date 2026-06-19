export interface Ticket {
  id?: number;
  numero?: string;
  voyageId: number;
  nombreBillets: number;
  montantTotal: number;
  methodePaiement: string;
  passagerNom: string;
  passagerEmail?: string;
  dateCreation?: string;
  statut?: string;
}

export interface TicketStats {
  totalTickets: number;
  revenuTotal: number;
  ticketsAujourdhui: number;
}
<<<<<<< HEAD

export interface TicketValidateResult {
  message: string;
  ticketId: number;
  passagerNom: string;
  voyageDest: string;
  statut: string;
}
=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
