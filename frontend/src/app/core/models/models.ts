export type Rol = 'ADMIN' | 'VETERINARIO' | 'RECEPCIONISTA';

export interface Usuario {
  id?: number;
  username: string;
  password?: string;
  rol: Rol;
  nombreCompleto: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  rol: Rol;
  nombreCompleto: string;
  expiraEnMs: number;
}

export interface Cliente {
  id?: number;
  nombre: string;
  telefono: string;
  email: string;
}

export interface Mascota {
  id?: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  cliente?: Cliente;
}

export interface Veterinario {
  id?: number;
  nombre: string;
  tarjetaProfesional: string;
  especialidad: string;
  telefono: string;
  email: string;
}

export interface Medicamento {
  id?: number;
  nombre: string;
  principioActivo: string;
  presentacion: string;
  precio: number;
  stock: number;
  stockMinimo: number;
}

export interface ConsultaMedica {
  id?: number;
  mascota: Mascota;
  veterinario: Veterinario;
  fechaHora?: string;
  motivo: string;
  pesoKg: number;
  temperaturaC: number;
  observaciones?: string;
}

export interface Diagnostico {
  id?: number;
  consulta: { id: number };
  descripcion: string;
  gravedad: string;
  tratamiento: string;
}

export interface Prescripcion {
  id?: number;
  consulta: { id: number };
  medicamento: Medicamento;
  dosis: string;
  duracion: string;
  cantidad: number;
}

/**
 * Cuerpos de peticion (POST/PUT). El backend relaciona entidades por id,
 * asi que las referencias viajan solo como { id } y no como el objeto completo.
 */
export interface Referencia {
  id: number;
}

export interface MascotaRequest {
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  cliente: Referencia;
}

export interface ConsultaRequest {
  mascota: Referencia;
  veterinario: Referencia;
  motivo: string;
  pesoKg: number;
  temperaturaC: number;
  observaciones: string;
}

export interface DiagnosticoRequest {
  consulta: Referencia;
  descripcion: string;
  gravedad: string;
  tratamiento: string;
}

export interface PrescripcionRequest {
  consulta: Referencia;
  medicamento: Referencia;
  dosis: string;
  duracion: string;
  cantidad: number;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
}
