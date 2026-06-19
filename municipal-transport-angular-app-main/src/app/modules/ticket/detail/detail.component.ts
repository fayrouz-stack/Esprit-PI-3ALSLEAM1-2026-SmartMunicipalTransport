import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../ticket.service';
import { Ticket, TicketValidateResult } from '../ticket.model';

@Component({
  selector: 'app-ticket-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketDetailComponent implements OnInit {

  private route    = inject(ActivatedRoute);
  private service  = inject(TicketService);
  private cdr      = inject(ChangeDetectorRef);

  ticket: Ticket | null = null;
  loading    = false;
  error      = '';

  // Validation état
  validating      = false;
  validateSuccess: TicketValidateResult | null = null;
  validateError   = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) { this.error = 'ID introuvable'; return; }
    this.loading = true;
    this.service.getById(Number(idParam)).subscribe({
      next:  (data) => { this.ticket = data;  this.loading = false; this.cdr.markForCheck(); },
      error: (err)  => { this.error  = 'Erreur chargement'; this.loading = false; this.cdr.markForCheck(); console.error(err); }
    });
  }

  validate(): void {
    if (!this.ticket?.id || this.validating) return;
    this.validating    = true;
    this.validateSuccess = null;
    this.validateError   = '';
    this.service.validate(this.ticket.id).subscribe({
      next: (res) => {
        this.validateSuccess   = res;
        if (this.ticket) this.ticket.statut = 'UTILISE';
        this.validating = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.validateError = err.error?.error ?? 'Erreur lors de la validation';
        this.validating = false;
        this.cdr.markForCheck();
      }
    });
  }

  statutColor(): string {
    switch (this.ticket?.statut) {
      case 'PAYE':      return 'success';
      case 'UTILISE':   return 'info';
      case 'ANNULE':    return 'danger';
      case 'EN_ATTENTE':return 'warning';
      default:          return 'secondary';
    }
  }
}
