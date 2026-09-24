import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/mascotas';

  listarTodas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.baseUrl}/${id}`);
  }

  listarPorCliente(clienteId: number): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.baseUrl}/cliente/${clienteId}`);
  }

  crear(mascota: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(this.baseUrl, mascota);
  }

  actualizar(id: number, mascota: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.baseUrl}/${id}`, mascota);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
