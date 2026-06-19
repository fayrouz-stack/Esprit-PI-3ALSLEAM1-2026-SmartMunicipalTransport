<<<<<<< HEAD
import { ChangeDetectorRef, Component, DestroyRef, DOCUMENT, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
=======
import { Component, DestroyRef, DOCUMENT, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { DashboardService, DashboardStats, EMPTY_STATS } from './dashboard.service';
import { ChatWidgetComponent } from './chat-widget/chat-widget.component';

// Interface for fleet management data
interface IUser {
  name: string;           // Chauffeur name
  state: string;         // Status (Actif/Récurrent/etc.)
  registered: string;    // Registration date
  country: string;       // Country code
  usage: number;         // Kilométrage (mileage)
  period: string;        // Period
  payment: string;       // Type (payment type)
  activity: string;      // Dernière alerte (last alert)
  avatar: string;        // Avatar URL
  status: string;        // Status for avatar
  color: string;         // Progress bar color
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [CommonModule, RouterLink, WidgetsDropdownComponent, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, CardFooterComponent, GutterDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent, TableDirective, AvatarComponent, ChatWidgetComponent]
})
export class DashboardComponent implements OnInit {

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);
  readonly #dashboardService: DashboardService = inject(DashboardService);
<<<<<<< HEAD
  readonly #cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced

  public stats: DashboardStats = { ...EMPTY_STATS };
  public users: IUser[] = [];
  public loadingUsers = true;
  public readonly Math = Math;
  public readonly currentYear = new Date().getFullYear();

  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  ngOnInit(): void {
    this.initCharts();
    this.updateChartOnColorModeChange();
    this.loadDashboard();
  }

  loadDashboard(): void {
    // Chaque API met à jour son propre bloc dès qu'elle répond
    this.#dashboardService.getVehiculesStats().subscribe({
      next: s => this.stats = { ...this.stats, ...s },
      error: err => console.error('Véhicules error', err)
    });
    this.#dashboardService.getVoyagesStats().subscribe({
      next: s => this.stats = { ...this.stats, ...s },
      error: err => console.error('Voyages error', err)
    });
    this.#dashboardService.getHorairesStats().subscribe({
      next: s => this.stats = { ...this.stats, ...s },
      error: err => console.error('Horaires error', err)
    });
    this.#dashboardService.getLignesStats().subscribe({
      next: s => this.stats = { ...this.stats, ...s },
      error: err => console.error('Lignes error', err)
    });
    this.#dashboardService.getStationsStats().subscribe({
      next: s => this.stats = { ...this.stats, ...s },
      error: err => console.error('Stations error', err)
    });
    this.#dashboardService.getTicketsStats().subscribe({
      next: s => this.stats = { ...this.stats, ...s },
      error: err => console.error('Tickets error', err)
    });
    this.#dashboardService.getChauffeurs().subscribe({
      next: chauffeurs => {
        try {
          const list = chauffeurs ?? [];
<<<<<<< HEAD
          const thirtyDaysAgo = Date.now() - 30 * 24 * 3600 * 1000;
          const actifs = list.filter((c: any) =>
            c.lastShiftEnd && new Date(c.lastShiftEnd).getTime() >= thirtyDaysAgo
=======
          const sevenDaysAgo = Date.now() - 7 * 24 * 3600 * 1000;
          const actifs = list.filter((c: any) =>
            c.lastShiftEnd && new Date(c.lastShiftEnd).getTime() >= sevenDaysAgo
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
          ).length;
          this.stats = {
            ...this.stats,
            totalChauffeurs:    list.length,
            chauffeurActifs:    actifs,
            chauffeurActifsPct: list.length > 0
              ? Math.round(actifs / list.length * 100)
              : 0,
          };
          this.users = this.buildUsers(list);
        } finally {
          this.loadingUsers = false;
        }
      },
      error: err => { console.error('Chauffeurs error', err); this.loadingUsers = false; }
    });
  }

  private buildUsers(chauffeurs: any[]): IUser[] {
    const COLORS = ['success', 'info', 'warning', 'danger', 'primary', 'dark'];
    const MONTHS = ['jan.', 'fév.', 'mar.', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    const maxDays = Math.max(...chauffeurs.map((c: any) => c.countWorkDays ?? 0), 1);
    return chauffeurs.slice(0, 10).map((c: any, i: number) => {
      const lastEnd = c.lastShiftEnd ? new Date(c.lastShiftEnd) : null;
      const diffH = lastEnd ? Math.floor((Date.now() - lastEnd.getTime()) / 3_600_000) : 9999;
      let activity: string;
      let status: string;
<<<<<<< HEAD
      if      (diffH <  2)  { activity = 'Il y a moins de 2h';              status = 'success';   }
      else if (diffH < 24)  { activity = `Il y a ${diffH}h`;                status = 'success';   }
      else if (diffH < 48)  { activity = 'Hier';                            status = 'info';      }
      else if (diffH < 720) { activity = `Il y a ${Math.floor(diffH/24)}j`; status = 'warning';   }
      else                  { activity = 'Inactif';                         status = 'secondary'; }
=======
      if      (diffH <  2)  { activity = 'Il y a moins de 2h';         status = 'success';   }
      else if (diffH < 24)  { activity = `Il y a ${diffH}h`;            status = 'success';   }
      else if (diffH < 48)  { activity = 'Hier';                        status = 'info';      }
      else                  { activity = `Il y a ${Math.floor(diffH / 24)}j`; status = 'secondary'; }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
      const ds = c.dateStart ? new Date(c.dateStart) : null;
      const registered = ds
        ? `${ds.getDate()} ${MONTHS[ds.getMonth()]} ${ds.getFullYear()}`
        : 'N/A';
      return {
        name:       `${c.prenom} ${c.nom}`,
<<<<<<< HEAD
        state:      diffH < 720 ? 'Actif' : 'Hors service',
=======
        state:      diffH < 24 ? 'Actif' : 'Hors service',
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
        registered,
        country:    'Tn',
        usage:      Math.round((c.countWorkDays ?? 0) / maxDays * 100),
        period:     `Congés restants: ${c.holidayRemaining ?? 0}j`,
        payment:    c.matricule ?? 'N/A',
        activity,
        avatar:     `./assets/images/avatars/${(i % 6) + 1}.jpg`,
        status,
        color:      COLORS[i % COLORS.length]
      };
    });
  }

  initCharts(): void {
    this.mainChartRef()?.stop();
    this.mainChart = this.#chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initMainChart(value);
    this.initCharts();
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }
}