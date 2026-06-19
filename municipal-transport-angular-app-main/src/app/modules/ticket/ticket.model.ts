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

export interface TicketValidateResult {
  message: string;
  ticketId: number;
  passagerNom: string;
  voyageDest: string;
  statut: string;
}
