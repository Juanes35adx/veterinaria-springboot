import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, Rol } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly STORAGE_KEY = 'protozoo_auth_session';
  currentUser = signal<LoginResponse | null>(this.loadSavedSession());

  isLoggedIn = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.rol || null);
  userName = computed(() => this.currentUser()?.nombreCompleto || this.currentUser()?.username || '');

  isAdmin = computed(() => this.userRole() === 'ADMIN');
  isVeterinario = computed(() => this.userRole() === 'VETERINARIO');
  isRecepcionista = computed(() => this.userRole() === 'RECEPCIONISTA');
  canManageClinic = computed(() => this.isAdmin() || this.isVeterinario());
  canDelete = computed(() => this.isAdmin());

  private loadSavedSession(): LoginResponse | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;
      const parsed: LoginResponse = JSON.parse(data);
      return parsed;
    } catch {
      return null;
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response));
        this.currentUser.set(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.currentUser()?.token || null;
  }
}
