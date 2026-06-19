<<<<<<< HEAD
import { Ligne } from '../ligne/ligne.model';
import { Station } from '../station/station.model';

export interface Horaire {
  id?: number;
  date_voyage: string;
  horaire_depart: string;
  horaire_arrive: string;
  retard_estime?: number;
  ligne?: Ligne;
  stationDepart?: Station;
  stationArrivee?: Station;
=======
export interface Horaire {
  id?: number;
  date_voyage: string;      // format YYYY-MM-DD
  horaire_depart: string;   // format HH:MM:SS
  horaire_arrive: string;   // format HH:MM:SS
  retard_estime?: number;   // en minutes
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}
