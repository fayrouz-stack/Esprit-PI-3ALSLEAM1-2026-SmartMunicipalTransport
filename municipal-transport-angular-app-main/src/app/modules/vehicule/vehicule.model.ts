export class Vehicule {
  id?: number;
  marque!: string;
  modele!: string;
  typeVehicule!: string;
  etat!: string;
  vehiculeDispo!: boolean;
  matriculeFourni!: string;
  localisation!: string;
  kilometrage!: number;
  dateFinAssurance!: Date | null;
  dateProchainCt!: Date | null;
  datePremiereMiseCirculation!: Date | null;
  carburant!: string;
  dateValiditeExploitation!: Date | null;
  latitude?: number | null;
  longitude?: number | null;

  constructor(data?: Partial<Vehicule>) {
    Object.assign(this, data);
  }
}

export type VehiculeEtat = 
  | 'disponible' 
  | 'en service' 
  | 'en panne' 
  | 'bon état' 
  | 'neuf' 
  | 'usé' 
  | 'en réparation';

export const ETATS = {
  'disponible': { label: 'Disponible', color: 'success', icon: 'cil-check-circle' },
  'en service': { label: 'En service', color: 'primary', icon: 'cil-truck' },
  'en panne': { label: 'En panne', color: 'danger', icon: 'cil-ban' },
  'bon état': { label: 'Bon état', color: 'info', icon: 'cil-check' },
  'neuf': { label: 'Neuf', color: 'success', icon: 'cil-star' },
  'usé': { label: 'Usé', color: 'secondary', icon: 'cil-warning' },
  'en réparation': { label: 'En réparation', color: 'warning', icon: 'cil-settings' }
};

export const CARBURANTS = [
  'Essence', 'Diesel', 'Électrique', 'Hybride', 'GPL'
];

export const MARQUES = [
  'Renault', 'Peugeot', 'Citroën', 'Mercedes', 'BMW', 'Audi', 'Volkswagen', 
  'Ford', 'Toyota', 'Nissan', 'Hyundai', 'Kia', 'Fiat', 'Volvo', 'MAN'
];

export const TYPES_VEHICULE = [
  'Voiture', 'Bus', 'Minibus', 'Camion', 'Utilitaire'
];