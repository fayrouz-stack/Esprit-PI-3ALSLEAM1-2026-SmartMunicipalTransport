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
}
