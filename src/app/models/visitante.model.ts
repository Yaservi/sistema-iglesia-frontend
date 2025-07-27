export interface Visitante {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  fechaVisita: string;
  eventoId: number;
}

export interface VisitanteCreate {
  nombre: string;
  apellido: string;
  telefono: string;
  fechaVisita: string;
  eventoId: number;
}
