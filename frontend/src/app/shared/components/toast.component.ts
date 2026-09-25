import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (t of notificationService.toasts(); track t.id) {
        <div class="toast-item" [ngClass]="'toast-' + t.type">
          <div class="toast-icon">
            @if (t.type === 'success') {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            } @else if (t.type === 'error') {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            } @else if (t.type === 'warning') {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            } @else {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            }
          </div>
          <div class="toast-content">
            @if (t.title) {
              <div class="toast-title">{{ t.title }}</div>
            }
            <div class="toast-message">{{ t.message }}</div>
          </div>
          <button class="toast-close" (click)="notificationService.remove(t.id)" aria-label="Cerrar notificacion">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 380px;
      width: calc(100% - 3rem);
      pointer-events: none;
    }
    .toast-item {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 0;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-left: 4px solid var(--primary);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.25s ease-out forwards;
      color: var(--text-main);
    }
    .toast-success { border-left-color: #10b981; }
    .toast-error { border-left-color: #ef4444; }
    .toast-warning { border-left-color: #f59e0b; }
    .toast-info { border-left-color: var(--primary); }
    .toast-icon { flex-shrink: 0; margin-top: 1px; color: var(--primary); }
    .toast-success .toast-icon { color: #10b981; }
    .toast-error .toast-icon { color: #ef4444; }
    .toast-warning .toast-icon { color: #f59e0b; }
    .toast-content { flex: 1; min-width: 0; }
    .toast-title { font-weight: 700; font-size: 0.8125rem; margin-bottom: 0.125rem; color: var(--text-main); }
    .toast-message { font-size: 0.75rem; color: var(--text-muted); line-height: 1.4; word-break: break-word; }
    .toast-close {
      background: transparent;
      border: none;
      font-size: 1.125rem;
      line-height: 1;
      color: var(--text-dim);
      cursor: pointer;
      padding: 0 2px;
      transition: color 0.15s ease;
    }
    .toast-close:hover { color: var(--text-main); }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  notificationService = inject(NotificationService);
}