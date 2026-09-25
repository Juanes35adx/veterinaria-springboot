import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsultaMedica, ConsultaRequest } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/consultas';

  listarTodas(): Observable<ConsultaMedica[]> {
    return this.http.get<ConsultaMedica[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<ConsultaMedica> {
    return this.http.get<ConsultaMedica>(`${this.baseUrl}/${id}`);
  }

  listarPorMascota(mascotaId: number): Observable<ConsultaMedica[]> {
    return this.http.get<ConsultaMedica[]>(`${this.baseUrl}/mascota/${mascotaId}`);
  }

  listarPorVeterinario(vetId: number): Observable<ConsultaMedica[]> {
    return this.http.get<ConsultaMedica[]>(`${this.baseUrl}/veterinario/${vetId}`);
  }

  crear(consulta: ConsultaRequest): Observable<ConsultaMedica> {
    return this.http.post<ConsultaMedica>(this.baseUrl, consulta);
  }

  actualizar(id: number, consulta: ConsultaRequest): Observable<ConsultaMedica> {
    return this.http.put<ConsultaMedica>(`${this.baseUrl}/${id}`, consulta);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
