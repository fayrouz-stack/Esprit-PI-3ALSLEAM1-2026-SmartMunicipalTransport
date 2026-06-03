import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../ticket.service';
import { Ticket } from '../ticket.model';

@Component({
  selector: 'app-ticket-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class TicketDetailComponent implements OnInit {

  ticket: Ticket | null = null;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private service: TicketService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) { this.error = 'ID introuvable'; return; }
    this.loading = true;
    this.service.getById(Number(idParam)).subscribe({
      next: (data) => { this.ticket = data; this.loading = false; },
      error: (err) => { this.error = 'Erreur chargement'; this.loading = false; console.error(err); }
    });
  }
}
