import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TicketService } from '../ticket.service';
import { Ticket } from '../ticket.model';

@Component({
  selector: 'app-ticket-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketListComponent implements OnInit {

  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);

  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];

  loading = false;
  searchTerm = '';
  filterStatut = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    if (this.tickets.length === 0) this.loading = true;
    this.ticketService.getAll().subscribe({
      next: (data) => {
        this.tickets = data;
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement tickets', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilters(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredTickets = this.tickets.filter(t =>
      (!this.searchTerm ||
        t.numero?.toLowerCase().includes(search) ||
        t.passagerNom?.toLowerCase().includes(search) ||
        t.passagerEmail?.toLowerCase().includes(search)) &&
      (!this.filterStatut || t.statut === this.filterStatut)
    );
    this.totalItems = this.filteredTickets.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterStatut = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  deleteTicket(id: number): void {
    if (confirm('Supprimer ce ticket ?')) {
      this.ticketService.delete(id).subscribe({
        next: () => this.loadTickets(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  get paginatedTickets(): Ticket[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTickets.slice(start, start + this.itemsPerPage);
  }

  previousPage(): void { if (this.currentPage > 1) this.currentPage--; }
  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }

  statutBadgeColor(statut?: string): string {
    switch (statut) {
      case 'PAYE': return 'success';
      case 'ANNULE': return 'danger';
      case 'EN_ATTENTE': return 'warning';
      default: return 'secondary';
    }
  }
}
