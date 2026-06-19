export interface Affectation {
  id?: number;
  chauffeurId: number;
  vehiculeId: number;
  ligneId: number;
  dateDebut: string;       // ISO datetime
  dateFin: string;         // ISO datetime
  statut?: string;         // PLANIFIEE, EN_COURS, TERMINEE, ANNULEE
  remarque?: string;
  dateCreation?: string;
}

/** Payload envoyé à POST /api/affectations/auto */
export interface AutoAssignRequest {
  ligneId: number;
  dateDebut: string; // ISO datetime
  dateFin: string;   // ISO datetime
}
