<<<<<<< HEAD
export interface Ligne {
  id?: number;
  numero: string;
  destination: string;
}

export interface Horaire {
  id?: number;
  date_voyage: string;
  horaire_depart: string;
  horaire_arrive: string;
  retard_estime?: number;
}

export interface Vehicule {
  id?: number;
  marque: string;
  modele: string;
  typeVehicule: string;
  etat: string;
  vehiculeDispo: boolean;
  matriculeFourni: string;
  localisation: string;
  kilometrage: number;
  carburant: string;
  dateFinAssurance: Date | null;
  dateProchainCt: Date | null;
  datePremiereMiseCirculation: Date | null;
  dateValiditeExploitation: Date | null;
}

export interface Chauffeur {
  matricule: string;
  nom: string;
  prenom: string;
}

export interface Voyage {
  id?: number;
  dateVoyage: string;
  nombrePlacesDisponible: number;
  prix: number;
  ligne: Ligne;
  horaire: Horaire;
  vehicule: Vehicule;
  chauffeur: Chauffeur;
=======
export interface Ligne {
  id?: number;
  numero: string;
  destination: string;
}

export interface Horaire {
  id?: number;
  date_voyage: string;
  horaire_depart: string;
  horaire_arrive: string;
  retard_estime?: number;
}

export interface Vehicule {
  id?: number;
  marque: string;
  modele: string;
  typeVehicule: string;
  etat: string;
  vehiculeDispo: boolean;
  matriculeFourni: string;
  localisation: string;
  kilometrage: number;
  carburant: string;
  dateFinAssurance: Date | null;
  dateProchainCt: Date | null;
  datePremiereMiseCirculation: Date | null;
  dateValiditeExploitation: Date | null;
}

export interface Chauffeur {
  matricule: string;
  nom: string;
  prenom: string;
}

export interface Voyage {
  id?: number;
  dateVoyage: string;
  nombrePlacesDisponible: number;
  prix: number;
  ligne: Ligne;
  horaire: Horaire;
  vehicule: Vehicule;
  chauffeur: Chauffeur;
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}