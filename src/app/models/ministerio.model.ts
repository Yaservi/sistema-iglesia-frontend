export interface Ministerio {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface MinisterioCreate {
  nombre: string;
  descripcion: string;
}
