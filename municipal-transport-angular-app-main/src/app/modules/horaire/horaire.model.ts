export interface Horaire {
  id?: number;
  date_voyage: string;      // format YYYY-MM-DD
  horaire_depart: string;   // format HH:MM:SS
  horaire_arrive: string;   // format HH:MM:SS
  retard_estime?: number;   // en minutes
}
