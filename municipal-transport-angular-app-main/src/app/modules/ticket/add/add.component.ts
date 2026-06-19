import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../ticket.service';
import { Ticket } from '../ticket.model';

@Component({
  selector: 'app-ticket-add',
  standalone: false,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class TicketAddComponent {

  ticket: Ticket = this.initForm();
  loading = false;

  constructor(private service: TicketService, private router: Router) {}

  private initForm(): Ticket {
    return {
      voyageId: 0,
      nombreBillets: 1,
      montantTotal: 0,
      methodePaiement: 'Espèces',
      passagerNom: '',
      passagerEmail: '',
      statut: 'PAYE'
    };
  }

  save(form: any): void {
    if (form.invalid || this.loading) return;
    this.loading = true;
    this.service.create(this.ticket).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tickets']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur création ticket', err);
      }
    });
  }
}
