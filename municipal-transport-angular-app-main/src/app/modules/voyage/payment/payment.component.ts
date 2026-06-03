import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VoyageService } from '../voyage.service';
import { Voyage } from '../models/voyage.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: false
})
export class PaymentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private voyageService = inject(VoyageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  paymentForm!: FormGroup;
  voyage: Voyage | null = null;
  loading = false;
  submitting = false;
  paymentResult: any = null;
  paymentError = '';
  paypalContact = 'paypal@transport.tn';

  ngOnInit(): void {
    this.initForm();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadVoyage(id);
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      passagerNom: ['', Validators.required],
      passagerEmail: ['', [Validators.required, Validators.email]],
      nbBillets: [1, [Validators.required, Validators.min(1)]],
      methode: ['CB', Validators.required],
      paymentAmount: [null]
    });
  }

  loadVoyage(id: number): void {
    this.loading = true;
    this.voyageService.getById(id).subscribe({
      next: (data) => {
        this.voyage = data;
        this.loading = false;
        // Mettre à jour la validation du nombre max de billets
        const nbBilletsControl = this.paymentForm.get('nbBillets');
        if (nbBilletsControl && this.voyage) {
          nbBilletsControl.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(this.voyage.nombrePlacesDisponible)
          ]);
          nbBilletsControl.updateValueAndValidity();
        }
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/voyages/list']);
      }
    });
  }

  get totalAmount(): number {
    if (!this.voyage) return 0;
    const nbBillets = this.paymentForm.get('nbBillets')?.value || 0;
    return this.voyage.prix * nbBillets;
  }

  onSubmit(): void {
    if (this.paymentForm.invalid || !this.voyage) {
      Object.keys(this.paymentForm.controls).forEach(key => {
        this.paymentForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.paymentForm.value;
    this.paymentError = '';

    // Validation spéciale pour Espèces
    if (formValue.methode === 'Espèces') {
      if (!formValue.paymentAmount || formValue.paymentAmount <= 0) {
        this.paymentError = 'Veuillez saisir le montant reçu en espèces.';
        return;
      }
      if (formValue.paymentAmount < this.totalAmount) {
        this.paymentError = 'Montant insuffisant pour couvrir le paiement.';
        return;
      }
    }

    const payload = {
      voyageId: this.voyage.id,
      nbBillets: formValue.nbBillets,
      methode: formValue.methode,
      passagerNom: formValue.passagerNom,
      passagerEmail: formValue.passagerEmail,
      paymentAmount: formValue.paymentAmount
    };

    this.submitting = true;
    this.voyageService.processPayment(payload).subscribe({
      next: (res) => {
        this.paymentResult = {
          ...res,
          qrdata: `TICKET:${res.ticketNumber}; PASSAGER:${formValue.passagerNom}; TOTAL:${res.total} DT`
        };
        this.submitting = false;
      },
      error: (err) => {
        this.paymentResult = null;
        this.paymentError = err?.message || 'Échec du paiement.';
        this.submitting = false;
      }
    });
  }

  resetPayment(): void {
    this.paymentResult = null;
    this.paymentError = '';
    this.paymentForm.patchValue({
      passagerNom: '',
      passagerEmail: '',
      nbBillets: 1,
      methode: 'CB',
      paymentAmount: null
    });
  }

  get f() {
    return this.paymentForm.controls;
  }

  get maxPlaces(): number {
    return this.voyage?.nombrePlacesDisponible || 1;
  }

  get qrImageUrl(): string {
    if (!this.paymentResult?.qrdata) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(this.paymentResult.qrdata)}&size=200x200&margin=10`;
  }
}