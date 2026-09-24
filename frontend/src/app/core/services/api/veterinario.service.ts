import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Veterinario } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/veterinarios';

  listarTodos(): Observable<Veterinario[]> {
    return this.http.get<Veterinario[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<Veterinario> {
    return this.http.get<Veterinario>(`${this.baseUrl}/${id}`);
  }

  crear(vet: Veterinario): Observable<Veterinario> {
    return this.http.post<Veterinario>(this.baseUrl, vet);
  }

  actualizar(id: number, vet: Veterinario): Observable<Veterinario> {
    return this.http.put<Veterinario>(`${this.baseUrl}/${id}`, vet);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
