export interface Miembro {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  sexo: string;
  direccion: string;
  telefono: string;
  correo: string;
  activo: boolean;
}

export interface MiembroCreate {
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  sexo: string;
  direccion: string;
  telefono: string;
  correo: string;
  activo: boolean;
}
