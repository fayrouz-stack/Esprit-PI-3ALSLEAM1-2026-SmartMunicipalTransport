import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { IncidentService } from '../modules/incident/incident.service';

@Injectable({ providedIn: 'root' })
export class ViolenceDetectionService {
  private readonly document = inject(DOCUMENT);
  private readonly incidentService = inject(IncidentService);
  private readonly router = inject(Router);

  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private hiddenVideoElement: HTMLVideoElement | null = null;
  private hiddenCanvasElement: HTMLCanvasElement | null = null;

  private previousFrame?: ImageData;
  private previousGray?: Uint8ClampedArray;
  private motionHistory: number[] = [];
  private motionWindowSize = 3;
  private suspiciousFramesRequired = 2; // require N suspicious frames in history
  private minMotionRatio = 0.02; // minimum motion ratio to consider a frame suspicious
  private pixelDeltaThreshold = 16; // per-pixel delta threshold
  private avgDeltaThreshold = 3; // mean delta threshold for low-coverage fast motion
  private manualMonitoringPayload?: { voyageId: number; type?: string; summary: string };
  private manualMonitoringSessionId = 0;
  private activeManualMonitoringSession = 0;
  private manualMonitoring = false;
  private manualMonitoringStartedAt?: number;
  private manualMonitoringStoppedAt?: number;
  private detectIntervalMs = 400;
  private autoDetectInterval?: number;
  private alertInProgress = false;
  private autoAlertsEnabled = false;
  private lastAlertAt?: number;
  private alertCooldownMs = 120000;
  // when user explicitly stops monitoring, suppress any in-flight alert
  private suppressAlertsOnStop = false;

  private cameraReadySubject = new BehaviorSubject(false);
  private cameraErrorSubject = new BehaviorSubject('');
  private detectionMessageSubject = new BehaviorSubject('');
  private monitoringMessageSubject = new BehaviorSubject('');
  private isSubmittingSubject = new BehaviorSubject(false);
  private alertCreatedSubject = new BehaviorSubject(false);
  private violenceDetectedSubject = new BehaviorSubject(false);

  public readonly cameraReady$ = this.cameraReadySubject.asObservable();
  public readonly cameraError$ = this.cameraErrorSubject.asObservable();
  public readonly detectionMessage$ = this.detectionMessageSubject.asObservable();
  public readonly monitoringMessage$ = this.monitoringMessageSubject.asObservable();
  public readonly isSubmitting$ = this.isSubmittingSubject.asObservable();
  public readonly alertCreated$ = this.alertCreatedSubject.asObservable();
  public readonly violenceDetected$ = this.violenceDetectedSubject.asObservable();

  public async startCamera(): Promise<void> {
    this.cameraErrorSubject.next('');
    this.detectionMessageSubject.next('');
    this.alertCreatedSubject.next(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.cameraErrorSubject.next('Votre navigateur ne supporte pas l\'accès à la caméra.');
      this.cameraReadySubject.next(false);
      return;
    }

    if (!window.isSecureContext && !['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)) {
      this.cameraErrorSubject.next('L’accès à la caméra nécessite HTTPS ou localhost. Veuillez utiliser une connexion sécurisée.');
      this.cameraReadySubject.next(false);
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch (error: unknown) {
      const isNotFound = error instanceof Error && error.name === 'NotFoundError';
      const isOverconstrained = error instanceof Error && error.name === 'OverconstrainedError';
      const isNotAllowed = error instanceof Error && ['NotAllowedError', 'SecurityError', 'PermissionDeniedError'].includes(error.name);

      if (isNotFound || isOverconstrained) {
        const constraintsCandidates = [
          { video: { facingMode: 'environment' }, audio: false },
          { video: { facingMode: 'user' }, audio: false }
        ];
        for (const constraints of constraintsCandidates) {
          try {
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            break;
          } catch {
            this.stream = null;
          }
        }
      }

      if (!this.stream) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        const deviceList = videoDevices.map((device) => device.label || 'Caméra inconnue').join(', ') || 'aucune caméra détectée';
        const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);

        if (isNotAllowed) {
          this.cameraErrorSubject.next(
            `Impossible d'accéder à la caméra. Autorisez l'accès à la caméra dans votre navigateur. ${message}. Périphériques vidéo détectés : ${deviceList}`
          );
        } else if (videoDevices.length === 0) {
          this.cameraErrorSubject.next(
            `Impossible d'accéder à la caméra. Aucune caméra détectée. ${message}. Vérifiez que votre caméra est branchée et disponible.`
          );
        } else {
          this.cameraErrorSubject.next(`Impossible d'accéder à la caméra. ${message}. Périphériques vidéo détectés : ${deviceList}`);
        }

        this.cameraReadySubject.next(false);
        return;
      }
    }

    this.applyStreamToVideo(this.stream);
    await this.waitForVideoReady(this.getActiveVideoElement());
    this.cameraReadySubject.next(true);
    this.previousGray = undefined;
    this.motionHistory = [];
    this.suppressAlertsOnStop = false;
    this.alertInProgress = false;
    this.manualMonitoring = false;
    this.manualMonitoringStartedAt = undefined;
    this.manualMonitoringStoppedAt = undefined;
    this.monitoringMessageSubject.next('Caméra prête. Appuyez sur Analyser pour démarrer.');
  }

  public stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.cameraReadySubject.next(false);
    this.monitoringMessageSubject.next('Surveillance arrêtée.');
    this.suppressAlertsOnStop = true;
    this.manualMonitoringSessionId += 1;
    this.stopAutoDetection();
    this.applyStreamToVideo(null);
    this.previousFrame = undefined;
    this.previousGray = undefined;
    this.motionHistory = [];
    this.manualMonitoring = false;
    this.manualMonitoringPayload = undefined;
  }

  public setPreviewElement(element: HTMLVideoElement | null): void {
    this.videoElement = element;
    if (element && this.stream) {
      element.srcObject = this.stream;
      element.muted = true;
      element.playsInline = true;
      element.autoplay = true;
      element.style.display = '';
      element.play().catch(() => undefined);
    }
  }

  public captureFrame(): { dataUrl: string; imageData: ImageData } | null {
    const video = this.getActiveVideoElement();
    const canvas = this.getHiddenCanvasElement();
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
      return null;
    }

    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return {
      dataUrl: canvas.toDataURL('image/jpeg', 0.7),
      imageData
    };
  }

  public analyseFrame(currentFrame: ImageData | null): { motionRatio: number; averageDelta: number; isSuspicious: boolean } {
    if (!currentFrame) {
      return { motionRatio: 0, averageDelta: 0, isSuspicious: false };
    }

    const width = currentFrame.width;
    const height = currentFrame.height;
    const totalPixels = width * height;

    // Convert to grayscale to reduce color/noise sensitivity
    const curGray = new Uint8ClampedArray(totalPixels);
    for (let i = 0, j = 0; i < currentFrame.data.length; i += 4, j++) {
      const r = currentFrame.data[i];
      const g = currentFrame.data[i + 1];
      const b = currentFrame.data[i + 2];
      // luma approximation
      curGray[j] = (0.299 * r + 0.587 * g + 0.114 * b) | 0;
    }

    if (!this.previousGray) {
      this.previousGray = curGray;
      this.previousFrame = currentFrame;
      this.motionHistory = [];
      return { motionRatio: 0, averageDelta: 0, isSuspicious: false };
    }

    let diffCount = 0;
    let diffSum = 0;
    for (let i = 0; i < totalPixels; i++) {
      const diff = Math.abs(curGray[i] - this.previousGray[i]);
      diffSum += diff;
      if (diff > this.pixelDeltaThreshold) {
        diffCount++;
      }
    }

    // move previous to current for next call
    this.previousGray = curGray;
    this.previousFrame = currentFrame;

    const motionRatio = diffCount / totalPixels;
    const averageDelta = diffSum / totalPixels;
    const frameSuspicious = motionRatio > this.minMotionRatio || averageDelta > this.avgDeltaThreshold;

    this.motionHistory.push(frameSuspicious ? 1 : 0);
    if (this.motionHistory.length > this.motionWindowSize) {
      this.motionHistory.shift();
    }

    const suspiciousFrames = this.motionHistory.reduce((sum, value) => sum + value, 0);
    const isSuspicious = suspiciousFrames >= this.suspiciousFramesRequired;

    return { motionRatio, averageDelta, isSuspicious };
  }

  public acknowledgeViolenceAlert(): void {
    this.violenceDetectedSubject.next(false);
    this.alertCreatedSubject.next(false);
  }

  private getActiveVideoElement(): HTMLVideoElement {
    return this.videoElement ?? this.getHiddenVideoElement();
  }

  private getHiddenVideoElement(): HTMLVideoElement {
    if (!this.hiddenVideoElement) {
      const video = this.document.createElement('video');
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      video.style.position = 'fixed';
      video.style.left = '-9999px';
      video.style.width = '1px';
      video.style.height = '1px';
      video.style.opacity = '0';
      video.style.pointerEvents = 'none';
      this.document.body.appendChild(video);
      this.hiddenVideoElement = video;
    }
    return this.hiddenVideoElement;
  }

  private getHiddenCanvasElement(): HTMLCanvasElement {
    if (!this.hiddenCanvasElement) {
      const canvas = this.document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.left = '-9999px';
      canvas.style.width = '1px';
      canvas.style.height = '1px';
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      this.document.body.appendChild(canvas);
      this.hiddenCanvasElement = canvas;
    }
    return this.hiddenCanvasElement;
  }

  private async waitForVideoReady(video: HTMLVideoElement): Promise<void> {
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA && video.videoWidth > 0 && video.videoHeight > 0) {
      return;
    }

    await new Promise<void>((resolve) => {
      const onReady = () => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          video.removeEventListener('loadedmetadata', onReady);
          resolve();
        }
      };

      video.addEventListener('loadedmetadata', onReady);
      const timeout = window.setTimeout(() => {
        video.removeEventListener('loadedmetadata', onReady);
        resolve();
      }, 3000);

      video.play().catch(() => undefined);
    });
  }

  private async startAutoDetection(): Promise<void> {
    this.stopAutoDetection();
    this.autoAlertsEnabled = true;
    this.monitoringMessageSubject.next(this.manualMonitoring ? 'Surveillance manuelle activée.' : 'Surveillance automatique activée.');
    const sessionId = this.manualMonitoringSessionId;
    const warmupMs = 1000;
    this.autoDetectInterval = window.setInterval(async () => {
      if (this.manualMonitoringSessionId !== sessionId) {
        return;
      }
      if (!this.autoAlertsEnabled || !this.cameraReadySubject.value) {
        return;
      }
      if (this.manualMonitoringStartedAt && Date.now() - this.manualMonitoringStartedAt < warmupMs) {
        return;
      }
      if (this.manualMonitoringStoppedAt && Date.now() - this.manualMonitoringStoppedAt < 600) {
        return;
      }
      const snapshot = this.captureFrame();
      if (!snapshot) {
        return;
      }
      const detection = this.analyseFrame(snapshot.imageData);
      if (!detection.isSuspicious) {
        if (this.manualMonitoring) {
          this.monitoringMessageSubject.next(
            `Analyse live : ${ (detection.motionRatio * 100).toFixed(2) }% pixels mouvants, avg ${ detection.averageDelta.toFixed(1) }`
          );
        }
        return;
      }
      if (this.manualMonitoringSessionId !== sessionId) {
        return;
      }
      if (!this.manualMonitoring) {
        return;
      }
      const now = Date.now();
      if (this.lastAlertAt && now - this.lastAlertAt < this.alertCooldownMs) {
        return;
      }
      this.lastAlertAt = now;
      // choose payload: manual monitoring uses provided payload, otherwise automatic
      const payload = this.manualMonitoringPayload
        ? { voyageId: this.manualMonitoringPayload.voyageId, type: this.manualMonitoringPayload.type ?? 'CAMERA_VIOLENCE', summary: this.manualMonitoringPayload.summary, imageData: snapshot.dataUrl }
        : { voyageId: 0, type: 'CAMERA_VIOLENCE', summary: 'Alerte automatique de violence détectée', imageData: snapshot.dataUrl };

      // if monitoring stopped after capture but before send, cancel the alert
      if (this.manualMonitoringSessionId !== sessionId) {
        return;
      }

      // if manualMonitoring payload provided, treat as manual alert for UI messages
      await this.sendCameraAlert(payload, !!this.manualMonitoringPayload);
    }, this.detectIntervalMs);
  }

  private stopAutoDetection(): void {
    if (this.autoDetectInterval !== undefined) {
      window.clearInterval(this.autoDetectInterval);
      this.autoDetectInterval = undefined;
    }
    this.autoAlertsEnabled = false;
  }

  public startManualMonitoring(payload: { voyageId: number; summary: string }, intervalMs = 500): void {
    this.manualMonitoringPayload = { voyageId: payload.voyageId, summary: payload.summary, type: 'CAMERA_VIOLENCE' };
    this.manualMonitoring = true;
    this.manualMonitoringSessionId += 1;
    this.activeManualMonitoringSession = this.manualMonitoringSessionId;
    this.manualMonitoringStartedAt = Date.now();
    this.manualMonitoringStoppedAt = undefined;
    this.suppressAlertsOnStop = false;
    this.previousGray = undefined;
    this.motionHistory = [];
    this.detectIntervalMs = intervalMs;
    this.monitoringMessageSubject.next('Surveillance manuelle activée.');
    // ensure camera started by caller
    this.startAutoDetection();
  }

  public stopManualMonitoring(): void {
    // suppress any alert that could be sent around the same time as the user stopping
    this.suppressAlertsOnStop = true;
    this.manualMonitoringStoppedAt = Date.now();
    this.manualMonitoringStartedAt = undefined;
    this.manualMonitoring = false;
    this.manualMonitoringSessionId += 1;
    this.activeManualMonitoringSession = 0;
    this.manualMonitoringPayload = undefined;
    this.monitoringMessageSubject.next('Surveillance manuelle arrêtée.');
    this.stopAutoDetection();
    this.previousGray = undefined;
    this.motionHistory = [];
  }

  private applyStreamToVideo(stream: MediaStream | null): void {
    this.getHiddenVideoElement();
    if (this.videoElement) {
      this.videoElement.srcObject = stream;
    }
    if (this.hiddenVideoElement) {
      this.hiddenVideoElement.srcObject = stream;
    }
  }

  public async reportManualCameraAlert(payload: { voyageId: number; type: string; summary: string; imageData?: string | null }): Promise<void> {
    await this.sendCameraAlert(payload, true);
  }

  private async sendCameraAlert(payload: { voyageId: number; type: string; summary: string; imageData?: string | null }, manual: boolean): Promise<void> {
    // if user just stopped monitoring, suppress any in-flight alert
    if (this.suppressAlertsOnStop) {
      this.suppressAlertsOnStop = false;
      return;
    }

    if (manual && !this.manualMonitoring) {
      return;
    }

    if (!this.cameraReadySubject.value || this.alertInProgress) {
      return;
    }

    this.alertInProgress = true;
    this.isSubmittingSubject.next(true);
    this.detectionMessageSubject.next(manual ? 'Analyse en cours...' : 'Surveillance automatique : incident détecté...');

    try {
      await firstValueFrom(this.incidentService.reportCameraAlert(payload));
      this.lastAlertAt = Date.now();
      this.alertCreatedSubject.next(true);
      this.violenceDetectedSubject.next(true);
      this.detectionMessageSubject.next('Incident détecté et enregistré.');
      this.monitoringMessageSubject.next(manual ? '' : 'Alerte automatique envoyée.');
      try {
        this.router.navigate(['/voyages', 'alerts']);
      } catch {
        // navigation failure should not block flow
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.detectionMessageSubject.next(`Erreur lors de l'enregistrement de l'alerte : ${message}`);
    } finally {
      this.isSubmittingSubject.next(false);
      this.alertInProgress = false;
    }
  }
}
