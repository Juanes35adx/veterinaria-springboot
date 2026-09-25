import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diagnostico, DiagnosticoRequest } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/diagnosticos';

  listarTodos(): Observable<Diagnostico[]> {
    return this.http.get<Diagnostico[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<Diagnostico> {
    return this.http.get<Diagnostico>(`${this.baseUrl}/${id}`);
  }

  listarPorConsulta(consultaId: number): Observable<Diagnostico[]> {
    return this.http.get<Diagnostico[]>(`${this.baseUrl}/consulta/${consultaId}`);
  }

  crear(diag: DiagnosticoRequest): Observable<Diagnostico> {
    return this.http.post<Diagnostico>(this.baseUrl, diag);
  }

  actualizar(id: number, diag: DiagnosticoRequest): Observable<Diagnostico> {
    return this.http.put<Diagnostico>(`${this.baseUrl}/${id}`, diag);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
