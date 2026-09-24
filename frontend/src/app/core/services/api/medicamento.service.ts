import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicamento } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/medicamentos';

  listarTodos(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<Medicamento> {
    return this.http.get<Medicamento>(`${this.baseUrl}/${id}`);
  }

  crear(med: Medicamento): Observable<Medicamento> {
    return this.http.post<Medicamento>(this.baseUrl, med);
  }

  actualizar(id: number, med: Medicamento): Observable<Medicamento> {
    return this.http.put<Medicamento>(`${this.baseUrl}/${id}`, med);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
