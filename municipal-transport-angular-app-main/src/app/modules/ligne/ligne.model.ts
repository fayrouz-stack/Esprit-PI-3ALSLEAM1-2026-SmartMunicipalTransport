import { Station } from '../station/station.model';

export interface Ligne {
  id?: number;
  numero: string;
  destination: string;
  stations?: Station[];
}
