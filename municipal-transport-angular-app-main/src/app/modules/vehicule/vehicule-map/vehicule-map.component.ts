import { Component, AfterViewInit, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ElementRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { environment } from '../../../environnement/environment';
import { VehiculeService } from '../vehicule.service';
import { VehiculeWebSocketService } from '../vehicule-websocket.service';

@Component({
  selector: 'app-vehicule-map',
  standalone: false,
  templateUrl: './vehicule-map.component.html',
  styleUrls: ['./vehicule-map.component.scss']
})
export class VehiculeMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() vehicle: any;
  @Input() location: string = '';

  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map: any;
  private marker: any;
  private trajectoryLine: L.Polyline | null = null;
  private trajectoryPoints: [number, number][] = [];

  private http         = inject(HttpClient);
  private vehiculeService = inject(VehiculeService);
  private wsService    = inject(VehiculeWebSocketService);
  private wsSub?: Subscription;

  // ── WebSocket : écoute les mises à jour pour CE véhicule ────────────────
  private subscribeWebSocket(): void {
    this.wsSub?.unsubscribe();
    if (!this.vehicle?.id) return;
    this.wsSub = this.wsService.position$.subscribe(pos => {
      if (pos.id !== this.vehicle?.id) return;
      // Mettre à jour les coordonnées locales
      this.vehicle = { ...this.vehicle, latitude: pos.latitude, longitude: pos.longitude };
      this.showAtCoords(pos.latitude, pos.longitude);
      // Ajouter le point à la trajectoire
      this.addTrajectoryPoint(pos.latitude, pos.longitude);
    });
    // Charger l'historique de trajectoire au démarrage
    this.loadTrajectoryHistory();
  }

  private loadTrajectoryHistory(): void {
    if (!this.vehicle?.id) return;
    this.http.get<any[]>(`${environment.apiUrl}/vehicules/${this.vehicle.id}/position-history`)
      .subscribe({
        next: (history) => {
          if (!history?.length) return;
          // Du plus ancien au plus récent
          this.trajectoryPoints = history
            .map((h: any) => [h.latitude, h.longitude] as [number, number])
            .reverse();
          this.drawTrajectory();
        }
      });
  }

  private addTrajectoryPoint(lat: number, lng: number): void {
    this.trajectoryPoints.push([lat, lng]);
    if (this.trajectoryPoints.length > 50) this.trajectoryPoints.shift();
    this.drawTrajectory();
  }

  private drawTrajectory(): void {
    if (!this.map || this.trajectoryPoints.length < 2) return;
    if (this.trajectoryLine) {
      this.trajectoryLine.setLatLngs(this.trajectoryPoints);
    } else {
      this.trajectoryLine = L.polyline(this.trajectoryPoints, {
        color: '#321fdb', weight: 2, opacity: 0.65, dashArray: '5 5'
      }).addTo(this.map);
    }
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return;
    if (changes['vehicle'] && this.vehicle?.latitude && this.vehicle?.longitude) {
      this.showAtCoords(this.vehicle.latitude, this.vehicle.longitude);
    } else if (changes['location'] && this.location) {
      this.searchAndShowLocation();
    }
    if (changes['vehicle'] && this.vehicle?.id) {
      this.subscribeWebSocket();
    }
  }

  private initMap(): void {
    if (this.map) return;
    this.map = L.map(this.mapContainer.nativeElement).setView([36.8065, 10.1815], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    if (this.vehicle?.latitude && this.vehicle?.longitude) {
      this.showAtCoords(this.vehicle.latitude, this.vehicle.longitude);
    } else if (this.location) {
      this.searchAndShowLocation();
    }

    // S'abonner aux mises à jour WS pour ce véhicule
    this.subscribeWebSocket();
  }

  private showAtCoords(lat: number, lon: number): void {
    this.map.setView([lat, lon], 14);
    if (this.marker) this.map.removeLayer(this.marker);
    const customIcon = L.divIcon({
      html: '<div style="background: linear-gradient(135deg, #2eb85c, #1a7a3f); width: 44px; height: 44px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 22px;">📍</div>',
      iconSize: [44, 44],
      popupAnchor: [0, -22]
    });
    this.marker = L.marker([lat, lon], { icon: customIcon }).addTo(this.map);
    this.loadWeatherAndTraffic(lat, lon);
  }

  private searchAndShowLocation(): void {
    const query = encodeURIComponent(this.location + ', Tunisie');
    this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=tn`)
      .subscribe((data: any) => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.map.setView([lat, lon], 13);
          if (this.marker) this.map.removeLayer(this.marker);
          const customIcon = L.divIcon({
            html: '<div style="background: linear-gradient(135deg, #667eea, #764ba2); width: 44px; height: 44px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 22px;">🚌</div>',
            iconSize: [44, 44],
            popupAnchor: [0, -22]
          });
          this.marker = L.marker([lat, lon], { icon: customIcon }).addTo(this.map);
          this.loadWeatherAndTraffic(lat, lon);
        }
      });
  }

  private loadWeatherAndTraffic(lat: number, lon: number): void {
    this.http.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`)
      .subscribe((weather: any) => {
        if (weather.current_weather) {
          const temp = weather.current_weather.temperature;
          const wind = weather.current_weather.windspeed;
          const code = weather.current_weather.weathercode;
          const condition = this.getWeatherIcon(code);
          this.http.get(`${environment.apiUrl}/vehicules/traffic?lat=${lat}&lon=${lon}`)
            .subscribe((traffic: any) => {
              this.marker.bindPopup(this.buildPopupHtml(condition, temp, wind, traffic)).openPopup();
            });
        }
      });
  }

  private buildPopupHtml(condition: string, temp: number, wind: number, traffic: any): string {
    return `
      <div style="font-family: Arial; min-width: 280px;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px; border-radius: 10px 10px 0 0;">
          <strong>${this.vehicle?.marque || 'Véhicule'}</strong><br>
          ${this.vehicle?.matriculeFourni || ''}
        </div>
        <div style="padding: 12px;">
          <div><span style="font-size:24px;">📍</span> ${this.location}</div>
          <div><span style="font-size:24px;">🌡️</span> ${condition} ${temp}°C, Vent: ${wind} km/h</div>
          <div><span style="font-size:24px;">🚦</span> ${traffic?.description || 'Trafic inconnu'}</div>
          <div style="margin-top:10px; font-size:12px; color:gray;">🚌 ${this.vehicle?.kilometrage || 0} km</div>
        </div>
      </div>
    `;
  }

  private getWeatherIcon(code: number): string {
    const icons: Record<number, string> = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌧️',53:'🌧️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',71:'🌨️',73:'🌨️',75:'🌨️',80:'🌦️',81:'🌦️',82:'🌦️',95:'⛈️'};
    return icons[code] || '☁️';
  }
}