import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar">
      <div class="navbar-left">
        <div class="brand">
          <div class="brand-logo-mark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">Proto<span class="brand-zoo">ZOO</span></span>
            <span class="brand-sub">Cl&iacute;nica Veterinaria</span>
          </div>
        </div>

        <div class="header-meta">
          <div class="header-contact">
            <svg class="contact-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span class="contact-main">321 321 3232</span>
            <span class="contact-sub">(Medell&iacute;n)</span>
          </div>
        </div>
      </div>

      <div class="navbar-right">
        <button type="button" class="btn btn-secondary btn-sm btn-theme" (click)="themeService.toggleTheme()" [title]="themeService.isDarkMode() ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'">
          @if (themeService.isDarkMode()) {
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <span class="theme-text">Claro</span>
          } @else {
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <span class="theme-text">Oscuro</span>
          }
        </button>

        <div class="user-block">
          <div class="user-avatar-sq">
            {{ getInitials(authService.userName()) }}
          </div>
          <div class="user-meta">
            <span class="user-name">{{ authService.userName() }}</span>
            <span class="badge" [ngClass]="getRoleBadgeClass(authService.userRole())">
              {{ authService.userRole() }}
            </span>
          </div>
        </div>

        <button type="button" class="btn btn-secondary btn-sm btn-logout" (click)="authService.logout()" title="Cerrar sesi&oacute;n">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Salir</span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      height: 56px;
      background: var(--bg-header);
      border-bottom: 2px solid var(--primary);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.25rem;
      position: sticky;
      top: 0;
      z-index: 90;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      transition: background-color 0.2s ease;
    }
    .navbar-left {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    .brand-logo-mark {
      width: 32px;
      height: 32px;
      background: var(--primary);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      font-family: var(--font-heading);
      font-size: 1.35rem;
      font-weight: 900;
      color: var(--proto-color);
      line-height: 1;
      letter-spacing: -0.03em;
    }
    .brand-zoo {
      color: var(--zoo-color);
    }
    .brand-sub {
      font-size: 0.625rem;
      color: var(--text-dim);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      line-height: 1;
      margin-top: 2px;
    }
    .header-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      border-left: 1px solid var(--border-color);
      padding-left: 1rem;
    }
    .header-contact {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .contact-icon {
      color: var(--primary);
    }
    .contact-main {
      font-weight: 700;
      color: var(--text-main);
      font-family: var(--font-mono);
    }
    .contact-sub {
      font-size: 0.6875rem;
      color: var(--text-dim);
    }
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .btn-theme {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      border-radius: 0;
      color: var(--text-main);
    }
    .theme-text {
      font-size: 0.6875rem;
    }
    .user-block {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.25rem 0.625rem;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
    }
    .user-avatar-sq {
      width: 26px;
      height: 26px;
      background: var(--primary);
      color: #ffffff;
      font-size: 0.6875rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-meta {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .user-name {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1;
    }
    .btn-logout {
      border-radius: 0;
    }
    @media (max-width: 900px) {
      .header-meta { display: none; }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  getRoleBadgeClass(role: string | null): string {
    if (role === 'ADMIN') return 'badge-danger';
    if (role === 'VETERINARIO') return 'badge-info';
    return 'badge-success';
  }
}