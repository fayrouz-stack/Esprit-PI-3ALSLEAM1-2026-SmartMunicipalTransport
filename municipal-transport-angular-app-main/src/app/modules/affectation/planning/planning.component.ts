<<<<<<< HEAD
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
=======
import { Component, OnInit, inject } from '@angular/core';
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
import { HttpClient } from '@angular/common/http';
import { AffectationService } from '../affectation.service';
import { Affectation } from '../affectation.model';
import { environment } from '../../../environnement/environment';

interface DayGroup {
  date: string;
  label: string;
  items: Affectation[];
}

@Component({
  selector: 'app-affectation-planning',
  standalone: false,
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class AffectationPlanningComponent implements OnInit {

  private service = inject(AffectationService);
  private http = inject(HttpClient);
  private apiBase = environment.apiUrl;
<<<<<<< HEAD
  private cdr = inject(ChangeDetectorRef);
=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced

  loading = false;
  weekStart: Date = this.startOfWeek(new Date());
  groups: DayGroup[] = [];

  // Maps pour résoudre les libellés
  chauffeursMap: Record<number, string> = {};
  vehiculesMap: Record<number, string> = {};
  lignesMap: Record<number, string> = {};

  ngOnInit(): void {
    this.http.get<any[]>(`${this.apiBase}/chauffeurs`).subscribe(d =>
      d.forEach(c => this.chauffeursMap[c.id] = `${c.prenom} ${c.nom}`));
    this.http.get<any[]>(`${this.apiBase}/vehicules`).subscribe(d =>
      d.forEach(v => this.vehiculesMap[v.id] = `${v.marque} ${v.modele}`));
    this.http.get<any[]>(`${this.apiBase}/lignes`).subscribe(d =>
      d.forEach(l => this.lignesMap[l.id] = `${l.numero} - ${l.destination}`));
    this.loadWeek();
  }

  private startOfWeek(d: Date): Date {
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // lundi
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  loadWeek(): void {
    this.loading = true;
    const debut = this.weekStart.toISOString();
    const fin = new Date(this.weekStart.getTime() + 7 * 86400000).toISOString();

    this.service.getPlanning(debut, fin).subscribe({
      next: (data) => {
        this.groups = this.buildGroups(data);
        this.loading = false;
<<<<<<< HEAD
        this.cdr.detectChanges();
      },
      error: (err) => { console.error(err); this.loading = false; this.cdr.detectChanges(); }
=======
      },
      error: (err) => { console.error(err); this.loading = false; }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
    });
  }

  private buildGroups(items: Affectation[]): DayGroup[] {
    const out: DayGroup[] = [];
    const labels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.weekStart.getTime() + i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const dayItems = items.filter(a => {
        const ad = new Date(a.dateDebut).toISOString().split('T')[0];
        return ad === dateStr;
      });
      out.push({
        date: dateStr,
        label: `${labels[i]} ${d.getDate()}/${d.getMonth() + 1}`,
        items: dayItems
      });
    }
    return out;
  }

  previousWeek(): void {
    this.weekStart = new Date(this.weekStart.getTime() - 7 * 86400000);
    this.loadWeek();
  }

  nextWeek(): void {
    this.weekStart = new Date(this.weekStart.getTime() + 7 * 86400000);
    this.loadWeek();
  }

  currentWeek(): void {
    this.weekStart = this.startOfWeek(new Date());
    this.loadWeek();
  }

  statutColor(statut?: string): string {
    switch (statut) {
      case 'PLANIFIEE': return 'info';
      case 'EN_COURS':  return 'primary';
      case 'TERMINEE':  return 'success';
      case 'ANNULEE':   return 'danger';
      default:          return 'secondary';
    }
  }
}
