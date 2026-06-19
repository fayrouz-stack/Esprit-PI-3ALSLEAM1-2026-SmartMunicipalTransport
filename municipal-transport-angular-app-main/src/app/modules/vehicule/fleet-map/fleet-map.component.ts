import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, inject
} from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { VehiculeService } from '../vehicule.service';
import { VehiculeWebSocketService, PositionUpdate } from '../vehicule-websocket.service';
import { Vehicule } from '../vehicule.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environnement/environment';

interface VehiculeMarker {
  vehicule: Vehicule;
  marker: L.Marker;
  polyline?: L.Polyline;
  history: [number, number][];   // [lat, lng][]
}

@Component({
  selector: 'app-fleet-map',
  standalone: false,
  templateUrl: './fleet-map.component.html',
  styleUrls: ['./fleet-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetMapComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('fleetMap') mapContainer!: ElementRef;

  private map!: L.Map;
  private vehiculeMarkers = new Map<number, VehiculeMarker>();
  private wsSub?: Subscription;
  private cdr = inject(ChangeDetectorRef);
  private vehiculeService = inject(VehiculeService);
  private wsService = inject(VehiculeWebSocketService);
  private http = inject(HttpClient);

  vehicules: Vehicule[] = [];
  loading = true;
  wsConnected = false;
  lastUpdate: Date | null = null;
  updateCount = 0;

  // Véhicules sans position GPS (liste latérale)
  get vehiculesSansPosition(): Vehicule[] {
    return this.vehicules.filter(v => !v.latitude || !v.longitude);
  }

  get vehiculesAvecPosition(): Vehicule[] {
    return this.vehicules.filter(v => v.latitude && v.longitude);
  }

  ngOnInit(): void {
    this.vehiculeService.getAll().subscribe({
      next: (data) => {
        this.vehicules = data ?? [];
        this.loading = false;
        this.cdr.markForCheck();
        // Placer les marqueurs initiaux après l'init de la carte
        setTimeout(() => this.placeInitialMarkers(), 200);
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });

    // S'abonner aux mises à jour WebSocket
    this.wsSub = this.wsService.position$.subscribe(pos => {
      this.onPositionUpdate(pos);
    });

    // État de connexion WS
    setInterval(() => {
      this.wsConnected = this.wsService.connected;
      this.cdr.markForCheck();
    }, 2000);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([36.8065, 10.1815], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  private placeInitialMarkers(): void {
    if (!this.map) return;
    this.vehicules
      .filter(v => v.latitude && v.longitude)
      .forEach(v => this.addOrUpdateMarker(v.id!, v.latitude!, v.longitude!, v));
  }

  private onPositionUpdate(pos: PositionUpdate): void {
    const existing = this.vehicules.find(v => v.id === pos.id);
    if (existing) {
      existing.latitude  = pos.latitude;
      existing.longitude = pos.longitude;
      if (pos.etat) existing.etat = pos.etat;
    } else {
      // Nouveau véhicule inconnu : ajouter temporairement
      this.vehicules.push({
        id: pos.id, marque: pos.marque ?? '?', modele: pos.modele ?? '',
        matriculeFourni: pos.matriculeFourni ?? '', etat: pos.etat ?? '',
        latitude: pos.latitude, longitude: pos.longitude
      } as Vehicule);
    }

    this.lastUpdate = new Date();
    this.updateCount++;
    this.addOrUpdateMarker(pos.id, pos.latitude, pos.longitude, existing);
    this.cdr.markForCheck();
  }

  private addOrUpdateMarker(id: number, lat: number, lng: number, v?: Vehicule | null): void {
    if (!this.map) return;
    const existing = this.vehiculeMarkers.get(id);
    const etat = v?.etat ?? '';
    const color = this.etatColor(etat);
    const label = v?.marque ? `${v.marque[0]}${v.modele?.[0] ?? ''}` : '🚌';

    const icon = L.divIcon({
      html: `<div style="
        background:${color};width:40px;height:40px;border-radius:50%;
        border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.35);
        display:flex;align-items:center;justify-content:center;
        color:white;font-weight:bold;font-size:.75rem;">
        ${label}
      </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -22]
    });

    if (existing) {
      // Déplacer le marqueur existant
      existing.marker.setLatLng([lat, lng]);
      existing.marker.setIcon(icon);

      // Mettre à jour la trajectoire
      existing.history.push([lat, lng]);
      if (existing.history.length > 50) existing.history.shift();
      if (existing.polyline) {
        existing.polyline.setLatLngs(existing.history);
      } else {
        existing.polyline = L.polyline(existing.history, {
          color, weight: 2, opacity: 0.6, dashArray: '4 4'
        }).addTo(this.map);
      }
    } else {
      const marker = L.marker([lat, lng], { icon }).addTo(this.map);
      marker.bindPopup(this.buildPopup(v, lat, lng));
      marker.on('click', () => {
        marker.setPopupContent(this.buildPopup(v, lat, lng));
        this.loadHistory(id);
      });
      this.vehiculeMarkers.set(id, { vehicule: v as Vehicule, marker, history: [[lat, lng]] });
    }

    // Mettre à jour le popup
    const vm = this.vehiculeMarkers.get(id);
    if (vm) vm.marker.setPopupContent(this.buildPopup(v, lat, lng));
  }

  private loadHistory(id: number): void {
    this.http.get<any[]>(`${environment.apiUrl}/vehicules/${id}/position-history`).subscribe({
      next: (history) => {
        const vm = this.vehiculeMarkers.get(id);
        if (!vm || !this.map) return;
        const coords: [number, number][] = history
          .map((h: any) => [h.latitude, h.longitude] as [number, number])
          .reverse(); // du plus ancien au plus récent
        vm.history = coords;
        if (vm.polyline) {
          vm.polyline.setLatLngs(coords);
        } else {
          vm.polyline = L.polyline(coords, {
            color: this.etatColor(vm.vehicule?.etat ?? ''),
            weight: 2, opacity: 0.7, dashArray: '4 4'
          }).addTo(this.map);
        }
      }
    });
  }

  private buildPopup(v: Vehicule | null | undefined, lat: number, lng: number): string {
    if (!v) return `<b>Véhicule inconnu</b><br>${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    const etatColor = this.etatColor(v.etat ?? '');
    return `
      <div style="min-width:200px;font-family:Arial">
        <div style="background:${etatColor};color:white;padding:8px 12px;border-radius:8px 8px 0 0;font-weight:bold">
          🚌 ${v.marque} ${v.modele}
        </div>
        <div style="padding:8px 12px">
          <div>🪪 <b>${v.matriculeFourni}</b></div>
          <div>⚙️ ${v.etat ?? '—'}</div>
          <div>📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
          <a href="/vehicules/detail/${v.id}" target="_blank"
             style="display:block;margin-top:6px;text-align:center;
                    background:#321fdb;color:white;border-radius:4px;padding:4px 8px;
                    text-decoration:none;font-size:.85rem">
            Voir la fiche →
          </a>
        </div>
      </div>`;
  }

  etatColor(etat: string): string {
    const map: Record<string, string> = {
      'disponible':    '#2eb85c',
      'en service':    '#321fdb',
      'en panne':      '#e55353',
      'en réparation': '#f9a825',
      'neuf':          '#6f42c1',
      'usé':           '#6c757d',
      'bon état':      '#1b8eb7'
    };
    return map[etat.toLowerCase()] ?? '#6c757d';
  }

  centerOnVehicule(v: Vehicule): void {
    if (!this.map || !v.latitude || !v.longitude) return;
    this.map.setView([v.latitude, v.longitude], 14);
    const vm = this.vehiculeMarkers.get(v.id!);
    vm?.marker.openPopup();
  }

  clearTrajectories(): void {
    this.vehiculeMarkers.forEach(vm => {
      if (vm.polyline) { this.map.removeLayer(vm.polyline); vm.polyline = undefined; }
      vm.history = [];
    });
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
    if (this.map) this.map.remove();
  }
}
