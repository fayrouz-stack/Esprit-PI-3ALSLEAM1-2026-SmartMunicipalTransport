import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environnement/environment';

@Component({
  selector: 'app-vehicule-calendar',
  standalone: false,
  templateUrl: './vehicule-calendar.component.html',
  styleUrls: ['./vehicule-calendar.component.scss']
})
export class VehiculeCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: (info: EventClickArg) => this.onEventClick(info)
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.http.get<any[]>(`${environment.apiUrl}/vehicules/alertes`)
      .subscribe({
        next: (alertes) => {
          this.calendarOptions = {
            ...this.calendarOptions,
            events: alertes.map(a => ({
              title: a.title,
              start: a.date,
              color: a.color,
              extendedProps: { vehicle: a.vehicle, vehiculeId: a.vehiculeId }
            }))
          };
        },
        error: (err) => {
          console.error('Erreur chargement alertes', err);
        }
      });
  }

  onEventClick(info: EventClickArg): void {
    const id = info.event.extendedProps['vehiculeId'];
    if (id) {
      this.router.navigate(['/vehicules/detail', id]);
    }
  }
}