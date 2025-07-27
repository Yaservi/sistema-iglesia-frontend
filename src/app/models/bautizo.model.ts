export interface Bautizo {
  id: number;
  miembroId: number;
  fecha: string;
  lugar: string;
  pastorOficiante: string;
}

export interface BautizoCreate {
  miembroId: number;
  fecha: string;
  lugar: string;
  pastorOficiante: string;
}
