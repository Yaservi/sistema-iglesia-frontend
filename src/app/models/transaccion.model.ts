export interface Transaccion {
  id: number;
  miembroId: number;
  tipo: string;
  monto: number;
  fecha: string;
  observacion: string;
}

export interface TransaccionCreate {
  miembroId: number;
  tipo: string;
  monto: number;
  fecha: string;
  observacion: string;
}
