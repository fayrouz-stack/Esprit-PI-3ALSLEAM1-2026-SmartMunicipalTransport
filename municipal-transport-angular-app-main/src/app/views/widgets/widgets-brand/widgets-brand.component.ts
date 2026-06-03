import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { ColComponent, RowComponent, WidgetStatDComponent } from '@coreui/angular';
import { ChartData } from 'chart.js';

type BrandData = {
  icon: string
  values: any[]
  capBg?: any
  color?: string
  labels?: string[]
  data: ChartData
}

@Component({
  selector: 'app-widgets-brand',
  templateUrl: './widgets-brand.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [RowComponent, ColComponent, WidgetStatDComponent, IconDirective, ChartjsComponent]
})
export class WidgetsBrandComponent implements AfterContentInit {
  private changeDetectorRef = inject(ChangeDetectorRef);

  readonly withCharts = input<boolean>();
  // @ts-ignore
  chartOptions = {
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3
      }
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };
  labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  datasets = {
    borderWidth: 2,
    fill: true
  };
  colors = {
    backgroundColor: 'rgba(255,255,255,.1)',
    borderColor: 'rgba(255,255,255,.55)',
    pointHoverBackgroundColor: '#fff',
    pointBackgroundColor: 'rgba(255,255,255,.55)'
  };
  brandData: BrandData[] = [
    {
      icon: 'cilSpeedometer',
      values: [{ title: 'voyages', value: '1.284' }, { title: 'ce mois', value: '+96' }],
      capBg: { '--cui-card-cap-bg': 'var(--cui-primary)' },
      labels: [...this.labels],
      data: {
        labels: [...this.labels],
        datasets: [{ ...this.datasets, data: [65, 59, 84, 84, 51, 55, 40], label: 'Voyages', ...this.colors }]
      }
    },
    {
      icon: 'cilPeople',
      values: [{ title: 'chauffeurs', value: '38' }, { title: 'disponibles', value: '24' }],
      capBg: { '--cui-card-cap-bg': 'var(--cui-info)' },
      data: {
        labels: [...this.labels],
        datasets: [{ ...this.datasets, data: [24, 30, 28, 35, 38, 36, 38], label: 'Chauffeurs', ...this.colors }]
      }
    },
    {
      icon: 'cilMap',
      values: [{ title: 'lignes', value: '12' }, { title: 'stations', value: '87' }],
      capBg: { '--cui-card-cap-bg': 'var(--cui-warning)' },
      data: {
        labels: [...this.labels],
        datasets: [{ ...this.datasets, data: [10, 10, 11, 11, 12, 12, 12], label: 'Lignes', ...this.colors }]
      }
    },
    {
      icon: 'cilCalendar',
      values: [{ title: 'horaires', value: '48' }, { title: 'retards', value: '3' }],
      capBg: { '--cui-card-cap-bg': 'var(--cui-danger)' },
      data: {
        labels: [...this.labels],
        datasets: [{ ...this.datasets, data: [2, 5, 1, 4, 3, 2, 3], label: 'Retards', ...this.colors }]
      }
    }
  ];

  capStyle(value: string) {
    return !!value ? { '--cui-card-cap-bg': value } : {};
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
