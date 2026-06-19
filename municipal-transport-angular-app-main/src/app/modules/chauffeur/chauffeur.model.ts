export interface Chauffeur {
  id?: number;
  cin: string;
  nom: string;
  prenom: string;
  permis: string;
  telephone: string;
  matricule: string;
  psw: string;
  email: string;

  holidayRemaining?: number;
  dateStart?: string;
  lastShiftStart?: string;
  lastShiftEnd?: string;
  countWorkDays?: number;
}
