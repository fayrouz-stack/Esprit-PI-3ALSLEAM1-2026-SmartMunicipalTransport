<<<<<<< HEAD
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { timeout } from 'rxjs';
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
  private cd = inject(ChangeDetectorRef);

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

  private luhnCheck(value: string): boolean {
    const digits = value.replace(/\D/g, '').split('').reverse().map(d => parseInt(d, 10));
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let digit = digits[i];
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  }

  private cardExpiryValidator(control: any): { [key: string]: unknown } | null {
    const value = control.value as string;
    if (!value) return null;
    const match = /^([01]\d)\/(\d{2})$/.exec(value.trim());
    if (!match) return { cardExpiry: true };
    const month = Number(match[1]);
    const year = Number(match[2]);
    if (month < 1 || month > 12) return { cardExpiry: true };

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { cardExpiry: true };
    }
    return null;
  }

  private cardNumberValidator(method: string): any {
    return (control: any) => {
      const value = (control.value || '').toString().replace(/\s+/g, '');
      if (!value) return null;
      if (method === 'CB') {
        if (!/^[45]\d{15}$/.test(value)) return { cardNumber: true };
        return null;
      }
      if (!/^\d{13,19}$/.test(value)) return { cardNumber: true };
      if (!this.luhnCheck(value)) return { cardNumber: true };
      return null;
    };
  }

  private cardCvvValidator(control: any): { [key: string]: unknown } | null {
    const value = (control.value || '').toString().trim();
    if (!value) return null;
    if (!/^\d{3,4}$/.test(value)) return { cardCvv: true };
    return null;
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      passagerNom: ['', Validators.required],
      passagerEmail: ['', [Validators.email]],
      nbBillets: [1, [Validators.required, Validators.min(1)]],
      methode: ['CB', Validators.required],
      paymentAmount: [null],
      cardNumber: [null],
      cardExpiry: [null],
      cardCvv: [null]
    });

    const emailControl = this.paymentForm.get('passagerEmail');
    const paymentAmountControl = this.paymentForm.get('paymentAmount');
    const cardNumberControl = this.paymentForm.get('cardNumber');
    const cardExpiryControl = this.paymentForm.get('cardExpiry');
    const cardCvvControl = this.paymentForm.get('cardCvv');
    const methodControl = this.paymentForm.get('methode');

    const applyMethodValidators = (m: string) => {
      if (m === 'PayPal') {
        emailControl?.setValidators([Validators.required, Validators.email]);
        this.paypalContact = emailControl?.value || '';
      } else {
        emailControl?.setValidators([Validators.email]);
      }
      emailControl?.updateValueAndValidity({ onlySelf: true });

      if (m === 'Espèces') {
        paymentAmountControl?.setValidators([
          Validators.required,
          Validators.min(0)
        ]);
      } else {
        paymentAmountControl?.clearValidators();
      }
      paymentAmountControl?.updateValueAndValidity({ onlySelf: true });

      if (m === 'CB' || m === 'Stripe') {
        cardNumberControl?.setValidators([
          Validators.required,
          this.cardNumberValidator(m)
        ]);
        cardExpiryControl?.setValidators([
          Validators.required,
          this.cardExpiryValidator.bind(this)
        ]);
        cardCvvControl?.setValidators([
          Validators.required,
          this.cardCvvValidator.bind(this)
        ]);
      } else {
        cardNumberControl?.clearValidators();
        cardExpiryControl?.clearValidators();
        cardCvvControl?.clearValidators();
      }
      cardNumberControl?.updateValueAndValidity({ onlySelf: true });
      cardExpiryControl?.updateValueAndValidity({ onlySelf: true });
      cardCvvControl?.updateValueAndValidity({ onlySelf: true });
    };

    methodControl?.valueChanges.subscribe((m: string) => applyMethodValidators(m));
    emailControl?.valueChanges.subscribe((email: string) => {
      if (this.paymentForm.get('methode')?.value === 'PayPal') {
        this.paypalContact = email;
      }
    });

    applyMethodValidators(this.paymentForm.get('methode')?.value ?? 'CB');

    this.paymentForm.get('nbBillets')?.valueChanges.subscribe(() => {
      paymentAmountControl?.updateValueAndValidity({ onlySelf: true });
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

  get isCardPayment(): boolean {
    const method = this.paymentForm.get('methode')?.value;
    return method === 'CB' || method === 'Stripe';
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

    const paymentAmount = Number(formValue.paymentAmount);

    if (formValue.methode === 'Espèces') {
      if (formValue.paymentAmount === null || formValue.paymentAmount === undefined || Number.isNaN(paymentAmount) || paymentAmount <= 0) {
        this.paymentError = 'Veuillez saisir le montant reçu en espèces.';
        return;
      }
      if (paymentAmount < this.totalAmount) {
        this.paymentError = 'Montant insuffisant pour couvrir le paiement.';
        return;
      }
      formValue.paymentAmount = paymentAmount;
    }

    if (formValue.methode === 'PayPal') {
      const emailControl = this.paymentForm.get('passagerEmail');
      if (!formValue.passagerEmail || emailControl?.invalid) {
        this.paymentError = 'Veuillez saisir une adresse email PayPal valide.';
        return;
      }
    }

    const payload = {
      voyageId: this.voyage.id,
      nbBillets: formValue.nbBillets,
      methode: formValue.methode,
      passagerNom: formValue.passagerNom,
      passagerEmail: formValue.passagerEmail,
      paymentAmount: formValue.paymentAmount ?? this.totalAmount,
      cardNumber: formValue.cardNumber,
      cardExpiry: formValue.cardExpiry,
      cardCvv: formValue.cardCvv
    };

    this.submitting = true;
    console.log('Payment submit payload', payload);

    this.voyageService.processPayment(payload)
      .pipe(timeout({ each: 10000 }))
      .subscribe({
        next: (res) => {
          console.log('Payment response', res);
          this.paymentResult = {
            ...res,
            qrdata: `TICKET:${res.ticketNumber}; PASSAGER:${formValue.passagerNom}; TOTAL:${res.total} DT`
          };

          if (this.voyage) {
            this.voyage.nombrePlacesDisponible = Math.max(0, this.voyage.nombrePlacesDisponible - formValue.nbBillets);
          }

          this.submitting = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Payment error', err);
          this.paymentResult = null;
          const backendError = err?.error?.error || err?.error?.message;
          if (err?.name === 'TimeoutError') {
            this.paymentError = 'Le paiement a pris trop de temps. Vérifiez la connexion au backend.';
          } else if (err?.status === 401) {
            this.paymentError = 'Session expirée ou non authentifiée. Veuillez vous reconnecter.';
          } else {
            this.paymentError = backendError || err?.message || 'Échec du paiement.';
          }

          this.submitting = false;
          this.cd.detectChanges();
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
=======
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
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}