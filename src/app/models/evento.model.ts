export interface Evento {
  id: number;
  nombre: string;
  tipo: string;
  fecha: string;
  lugar: string;
}

export interface EventoCreate {
  nombre: string;
  tipo: string;
  fecha: string;
  lugar: string;
}
