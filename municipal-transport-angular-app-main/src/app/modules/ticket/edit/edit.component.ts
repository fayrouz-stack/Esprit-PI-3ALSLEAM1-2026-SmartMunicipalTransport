import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../ticket.service';
import { Ticket } from '../ticket.model';

@Component({
  selector: 'app-ticket-edit',
  standalone: false,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class TicketEditComponent implements OnInit {

  ticket: Ticket = this.initForm();
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private service: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.service.getById(id).subscribe({
      next: (data) => { this.ticket = { ...this.initForm(), ...data }; },
      error: (err) => console.error(err)
    });
  }

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

  update(form: any): void {
    if (form.invalid || this.loading) return;
    this.loading = true;
    this.service.update(this.ticket.id!, this.ticket).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tickets']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }
}
