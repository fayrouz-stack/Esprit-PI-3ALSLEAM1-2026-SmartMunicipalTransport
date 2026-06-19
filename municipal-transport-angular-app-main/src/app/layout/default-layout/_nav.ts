import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    name: 'Véhicules',
    url: '/vehicules',
    icon: 'cil-car'
  },
  {
    name: 'Carte Flotte 🗺️',
    url: '/vehicules/fleet',
    icon: 'cil-map'
  },
  {
    name: 'Chauffeurs',
    url: '/chauffeurs',
    iconComponent: { name: 'cil-people' }
  },
  {
    name: 'Lignes',
    url: '/lignes',
    iconComponent: { name: 'cil-map' }
  },
  {
    name: 'Stations',
    url: '/stations',
    iconComponent: { name: 'cil-location-pin' }
  },
  {
    name: 'Horaires',
    url: '/horaires',
    iconComponent: { name: 'cil-clock' }
  },
  {
    name: 'Voyages',
    url: '/voyages',
    iconComponent: { name: 'cil-bus-alt' }
  },
  {
    name: 'Alertes caméra',
    url: '/incidents',
    iconComponent: { name: 'cil-camera' }
  },
  {
    name: 'Tickets',
    url: '/tickets',
    iconComponent: { name: 'cil-money' }
  },
  {
    name: 'Affectations',
    url: '/affectations',
    iconComponent: { name: 'cil-calendar' }
  }
];