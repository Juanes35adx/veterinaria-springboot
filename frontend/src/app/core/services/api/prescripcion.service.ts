import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescripcion } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class PrescripcionService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/prescripciones';

  listarTodas(): Observable<Prescripcion[]> {
    return this.http.get<Prescripcion[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<Prescripcion> {
    return this.http.get<Prescripcion>(`${this.baseUrl}/${id}`);
  }

  listarPorConsulta(consultaId: number): Observable<Prescripcion[]> {
    return this.http.get<Prescripcion[]>(`${this.baseUrl}/consulta/${consultaId}`);
  }

  crear(prescripcion: any): Observable<Prescripcion> {
    return this.http.post<Prescripcion>(this.baseUrl, prescripcion);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
