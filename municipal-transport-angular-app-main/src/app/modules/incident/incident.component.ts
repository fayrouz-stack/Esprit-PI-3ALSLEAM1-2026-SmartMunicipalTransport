import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IncidentService } from './incident.service';
import { VoyageService } from '../voyage/voyage.service';
import { Voyage } from '../voyage/models/voyage.model';
import { ViolenceDetectionService } from '../../services/violence-detection.service';

@Component({
  selector: 'app-incident',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incident.component.html'
})
export class IncidentComponent implements OnInit, OnDestroy {
  @ViewChild('preview') previewRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('snapshotCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  public form: FormGroup;
  public voyages: Voyage[] = [];
  public cameraReady = false;
  public cameraError = '';
  public detectionMessage = '';
  public isSubmitting = false;
  public alertCreated = false;
  public popupVisible = false;
  public popupTitle = '';
  public popupImage: string | null = null;
  public monitoringMessage = '';
  public lastCapture: string | null = null;
  public monitoringActive = false;

  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private voyageService: VoyageService,
    private violenceService: ViolenceDetectionService
  ) {
    this.form = this.fb.group({
      voyageId: [null, Validators.required],
      summary: ['Suspicion de violence détectée par la caméra', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadVoyages();
    this.subscribeToViolenceDetection();
  }

  ngOnDestroy(): void {
    this.stopCamera();
    this.subscriptions.unsubscribe();
  }

  private loadVoyages(): void {
    this.subscriptions.add(
      this.voyageService.getAll().subscribe({
        next: (voyages) => (this.voyages = voyages),
        error: (err) => {
          console.error('Impossible de charger les voyages', err);
          this.cameraError = 'Impossible de charger les voyages.';
        }
      })
    );
  }

  private subscribeToViolenceDetection(): void {
    this.subscriptions.add(
      this.violenceService.cameraReady$.subscribe((ready) => (this.cameraReady = ready))
    );
    this.subscriptions.add(
      this.violenceService.cameraError$.subscribe((error) => (this.cameraError = error))
    );
    this.subscriptions.add(
      this.violenceService.detectionMessage$.subscribe((message) => (this.detectionMessage = message))
    );
    this.subscriptions.add(
      this.violenceService.monitoringMessage$.subscribe((message) => (this.monitoringMessage = message))
    );
    this.subscriptions.add(
      this.violenceService.isSubmitting$.subscribe((submitting) => (this.isSubmitting = submitting))
    );
    this.subscriptions.add(
      this.violenceService.alertCreated$.subscribe((created) => (this.alertCreated = created))
    );
  }

  public async startCamera(): Promise<void> {
    this.alertCreated = false;
    if (this.previewRef?.nativeElement) {
      this.violenceService.setPreviewElement(this.previewRef.nativeElement);
    }
    await this.violenceService.startCamera();
  }

  public stopCamera(): void {
    this.monitoringActive = false;
    this.violenceService.stopCamera();
  }

  public async detectIncident(): Promise<void> {
    if (!this.cameraReady) {
      this.detectionMessage = 'Démarrez d\'abord la caméra.';
      return;
    }

    if (this.form.invalid) {
      this.detectionMessage = 'Sélectionnez d\'abord un voyage valide.';
      return;
    }

    // Toggle manual continuous monitoring: start if inactive, stop if active
    if (!this.monitoringActive) {
      const payload = {
        voyageId: this.form.get('voyageId')?.value,
        summary: this.form.get('summary')?.value
      };
      this.monitoringActive = true;
      this.detectionMessage = 'Surveillance manuelle démarrée.';
      if (this.previewRef?.nativeElement) {
        this.violenceService.setPreviewElement(this.previewRef.nativeElement);
      }
      this.violenceService.startManualMonitoring(payload);
    } else {
      this.monitoringActive = false;
      this.detectionMessage = 'Surveillance manuelle arrêtée.';
      this.violenceService.stopManualMonitoring();
    }
  }

  public closePopup(): void {
    this.popupVisible = false;
  }
}
