import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ButtonModule, CardModule, FormModule } from '@coreui/angular';
import { VoyageService } from '../voyage.service';
import { IncidentService } from '../../incident/incident.service';
import { Voyage } from '../models/voyage.model';

@Component({
  selector: 'app-alert-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, FormModule, ButtonModule],
  templateUrl: './add-alert.component.html'
})
export class AddAlertComponent implements OnInit {
  private fb = inject(FormBuilder);
  private voyageService = inject(VoyageService);
  private incidentService = inject(IncidentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  voyages: Voyage[] = [];
  selectedVoyage?: Voyage;
  submitting = false;

  form = this.fb.group({
    voyageId: [0],
    detectionTime: [new Date().toISOString().slice(0, 16)],
    summary: ['']
  });

  ngOnInit(): void {
    this.loadVoyages();
    this.form.get('voyageId')?.valueChanges.subscribe((id) => this.onVoyageChange(Number(id || 0)));
    const q = this.route.snapshot.queryParamMap.get('voyageId');
    if (q) {
      const id = Number(q);
      if (!Number.isNaN(id) && id > 0) {
        this.form.get('voyageId')?.setValue(id);
      }
    }
  }

  loadVoyages(): void {
    this.voyageService.getAll().subscribe((data) => this.voyages = data || []);
  }

  onVoyageChange(id: number): void {
    this.selectedVoyage = this.voyages.find(v => v.id === Number(id));
    if (this.selectedVoyage && !this.form.get('summary')?.value) {
      const chauffeur = this.selectedVoyage.chauffeur ? `${this.selectedVoyage.chauffeur.nom} ${this.selectedVoyage.chauffeur.prenom}` : 'Chauffeur inconnu';
      const trajet = `${this.selectedVoyage.ligne?.numero || '#'} → ${this.selectedVoyage.ligne?.destination || ''}`;
      const time = this.form.get('detectionTime')?.value || new Date().toLocaleString();
      this.form.get('summary')?.setValue(`Détection: ${time} · Chauffeur: ${chauffeur} · Trajet: ${trajet}`);
    }
  }

  submit(): void {
    if (this.submitting) return;
    const voyageId = Number(this.form.get('voyageId')?.value) || 0;
    const summary = this.form.get('summary')?.value || '';
    const payload = { voyageId, type: 'MANUAL_ALERT', summary };
    this.submitting = true;
    this.incidentService.reportCameraAlert(payload).subscribe({
      next: () => this.router.navigate(['/voyages', 'alerts']),
      error: () => { this.submitting = false; }
    });
  }
}
