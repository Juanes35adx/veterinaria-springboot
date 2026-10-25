import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationService } from '../../core/services/notification.service';
import { ToastComponent } from '../../shared/components/toast.component';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastComponent],
  template: `
    <div class="login-wrapper">
      <div class="login-theme-bar">
        <button type="button" class="btn btn-secondary btn-sm" (click)="themeService.toggleTheme()">
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
            <span>Modo Claro</span>
          } @else {
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <span>Modo Oscuro</span>
          }
        </button>
      </div>

      <div class="login-card">
        <div class="login-header">
          <div class="logo-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h1 class="login-title">Proto<span class="brand-zoo">ZOO</span></h1>
          <p class="login-subtitle">Gesti&oacute;n Cl&iacute;nica &amp; Farmacia</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label class="form-label" for="username">Usuario</label>
            <div class="input-icon-wrapper">
              <span class="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input
                id="username"
                type="text"
                class="form-control field-with-icon"
                placeholder="Ingresa tu usuario"
                formControlName="username"
                autocomplete="username"
              >
            </div>
            @if (loginForm.get('username')?.touched && loginForm.get('username')?.invalid) {
              <span class="field-error">El usuario es requerido.</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Contrase&ntilde;a</label>
            <div class="input-icon-wrapper">
              <span class="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="0"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                id="password"
                type="password"
                class="form-control field-with-icon"
                placeholder="Ingresa tu contrase&ntilde;a"
                formControlName="password"
                autocomplete="current-password"
              >
            </div>
            @if (loginForm.get('password')?.touched && loginForm.get('password')?.invalid) {
              <span class="field-error">La contrase&ntilde;a es requerida.</span>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-submit"
            [disabled]="loginForm.invalid || isLoading"
          >
            @if (isLoading) {
              <span>Validando credenciales...</span>
            } @else {
              <span>Ingresar al Sistema</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            }
          </button>
        </form>
      </div>
      <app-toast></app-toast>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--bg-body);
      padding: 1.5rem;
      position: relative;
      transition: background-color 0.2s ease;
    }
    .login-theme-bar {
      position: absolute;
      top: 1rem;
      right: 1.5rem;
    }
    .login-card {
      background: var(--card-bg);
      width: 100%;
      max-width: 420px;
      border: 1px solid var(--border-color);
      border-top: 4px solid var(--primary);
      padding: 2.25rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .login-header {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.375rem;
    }
    .logo-box {
      width: 44px;
      height: 44px;
      background: var(--primary);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.25rem;
    }
    .login-title {
      font-size: 1.75rem;
      font-weight: 900;
      color: var(--proto-color);
      letter-spacing: -0.03em;
    }
    .brand-zoo {
      color: var(--zoo-color);
    }
    .login-subtitle {
      font-size: 0.6875rem;
      color: var(--text-dim);
      font-weight: 700;
      font-family: var(--font-mono);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .input-icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .field-icon {
      position: absolute;
      left: 0.75rem;
      color: var(--text-dim);
      display: flex;
      align-items: center;
      pointer-events: none;
    }
    .field-with-icon {
      padding-left: 2.25rem;
    }
    .field-error {
      font-size: 0.6875rem;
      color: var(--danger-text);
      margin-top: 0.25rem;
    }
    .btn-submit {
      width: 100%;
      padding: 0.625rem;
      font-size: 0.8125rem;
      margin-top: 0.5rem;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  themeService = inject(ThemeService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  isLoading = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { username, password } = this.loginForm.value;

    this.authService.login({ username: username!, password: password! }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notificationService.success(`Bienvenido/a, ${res.nombreCompleto || res.username}`, 'Acceso correcto');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}