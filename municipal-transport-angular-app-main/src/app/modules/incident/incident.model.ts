export interface IncidentAlert {
  id?: number;
  voyageId: number;
  type: string;
  summary: string;
  createdAt?: string;
  active?: boolean;
}
