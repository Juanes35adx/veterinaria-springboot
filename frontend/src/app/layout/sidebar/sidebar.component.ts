import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed()">
      <div class="sidebar-toggle-row">
        @if (!isCollapsed()) {
          <span class="sidebar-brand-caption">NAVEGACI&Oacute;N</span>
        }
        <button
          type="button"
          class="btn-collapse"
          (click)="toggleCollapse()"
          [title]="isCollapsed() ? 'Desplegar barra lateral' : 'Plegar barra lateral'"
          aria-label="Plegar o desplegar menu"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            @if (isCollapsed()) {
              <polyline points="9 18 15 12 9 6"></polyline>
            } @else {
              <polyline points="15 18 9 12 15 6"></polyline>
            }
          </svg>
        </button>
      </div>

      <div class="sidebar-section">
        @if (!isCollapsed()) {
          <span class="section-title">PRINCIPAL</span>
        }
        <nav class="nav-list">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" [title]="'Dashboard'">
            <svg class="nav-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            @if (!isCollapsed()) {
              <span class="nav-label">Dashboard</span>
            }
          </a>
        </nav>
      </div>

      <div class="sidebar-section">
        @if (!isCollapsed()) {
          <span class="section-title">MOSTRADOR &amp; PACIENTES</span>
        }
        <nav class="nav-list">
          <a routerLink="/clientes" routerLinkActive="active" class="nav-item" [title]="'Clientes / Due&ntilde;os'">
            <svg class="nav-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            @if (!isCollapsed()) {
              <span class="nav-label">Clientes / Due&ntilde;os</span>
            }
          </a>
          <a routerLink="/mascotas" routerLinkActive="active" class="nav-item" [title]="'Pacientes / Mascotas'">
            <svg class="nav-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <circle cx="6" cy="9" r="2"></circle>
              <circle cx="18" cy="9" r="2"></circle>
              <circle cx="9" cy="17" r="2"></circle>
              <circle cx="15" cy="17" r="2"></circle>
            </svg>
            @if (!isCollapsed()) {
              <span class="nav-label">Pacientes / Mascotas</span>
            }
          </a>
        </nav>
      </div>

      @if (authService.canManageClinic()) {
        <div class="sidebar-section">
          @if (!isCollapsed()) {
            <span class="section-title">&Aacute;REA CL&Iacute;NICA</span>
          }
          <nav class="nav-list">
            <a routerLink="/consultas" routerLinkActive="active" class="nav-item" [title]="'Consultas &amp; HC'">
              <svg class="nav-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              @if (!isCollapsed()) {
                <span class="nav-label">Consultas &amp; HC</span>
              }
            </a>
          </nav>
        </div>
      }

      <div class="sidebar-section">
        @if (!isCollapsed()) {
          <span class="section-title">SERVICIOS &amp; ALMAC&Eacute;N</span>
        }
        <nav class="nav-list">
          <a routerLink="/medicamentos" routerLinkActive="active" class="nav-item" [title]="'Farmacia &amp; Stock'">
            <svg class="nav-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="0"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            @if (!isCollapsed()) {
              <span class="nav-label">Farmacia &amp; Stock</span>
            }
          </a>
          <a routerLink="/veterinarios" routerLinkActive="active" class="nav-item" [title]="'Equipo Veterinario'">
            <svg class="nav-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
            @if (!isCollapsed()) {
              <span class="nav-label">Equipo Veterinario</span>
            }
          </a>
        </nav>
      </div>

      @if (authService.isAdmin()) {
        <div class="sidebar-section">
          @if (!isCollapsed()) {
            <span class="section-title">ADMINISTRACI&Oacute;N</span>
          }
          <nav class="nav-list">
            <a routerLink="/usuarios" routerLinkActive="active" class="nav-item" [title]="'Usuarios del Sistema'">
              <svg class="nav-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="0"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              @if (!isCollapsed()) {
                <span class="nav-label">Usuarios del Sistema</span>
              }
            </a>
          </nav>
        </div>
      }
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 230px;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      padding: 0.75rem 0.5rem;
      gap: 1.125rem;
      flex-shrink: 0;
      min-height: calc(100vh - 56px);
      transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease, border-color 0.2s ease;
    }
    .sidebar.collapsed {
      width: 60px;
      padding: 0.75rem 0.25rem;
      gap: 0.875rem;
    }
    .sidebar-toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.5rem 0.5rem 0.5rem;
      border-bottom: 1px solid var(--border-subtle);
      min-height: 32px;
    }
    .sidebar.collapsed .sidebar-toggle-row {
      justify-content: center;
      padding: 0 0 0.5rem 0;
    }
    .sidebar-brand-caption {
      font-size: 0.625rem;
      font-weight: 800;
      color: var(--text-dim);
      letter-spacing: 0.08em;
      font-family: var(--font-mono);
    }
    .btn-collapse {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 0;
      transition: all 0.15s ease;
    }
    .btn-collapse:hover {
      background: var(--bg-surface);
      color: var(--primary);
      border-color: var(--primary);
    }
    .sidebar-section {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .sidebar.collapsed .sidebar-section {
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.5rem;
    }
    .sidebar.collapsed .sidebar-section:first-of-type {
      border-top: none;
      padding-top: 0;
    }
    .section-title {
      font-size: 0.625rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-dim);
      padding: 0 0.5rem;
      margin-bottom: 0.125rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .nav-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.5625rem 0.625rem;
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.8125rem;
      transition: all 0.15s ease;
      text-decoration: none;
      border-left: 3px solid transparent;
      border-radius: 0;
      white-space: nowrap;
    }
    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 0.625rem 0;
    }
    .nav-svg {
      color: var(--text-dim);
      flex-shrink: 0;
      transition: color 0.15s ease;
    }
    .nav-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .nav-item:hover {
      background: var(--bg-subtle);
      color: var(--text-main);
    }
    .nav-item:hover .nav-svg {
      color: var(--primary);
    }
    .nav-item.active {
      background: var(--primary-light);
      color: var(--primary);
      border-left-color: var(--primary);
      font-weight: 700;
    }
    .nav-item.active .nav-svg {
      color: var(--primary);
    }
  `]
})
export class SidebarComponent {
  authService = inject(AuthService);
  isCollapsed = signal<boolean>(localStorage.getItem('protozoo-sidebar-collapsed') === 'true');

  toggleCollapse(): void {
    const next = !this.isCollapsed();
    this.isCollapsed.set(next);
    localStorage.setItem('protozoo-sidebar-collapsed', String(next));
  }
}