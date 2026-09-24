import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal [isOpen]="isOpen" [title]="title" maxWidth="440px" (close)="cancel.emit()">
      <div body class="confirm-body">
        <div class="confirm-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <p class="confirm-message">{{ message }}</p>
      </div>
      <div footer>
        <button type="button" class="btn btn-secondary" (click)="cancel.emit()">Cancelar</button>
        <button type="button" class="btn btn-danger" (click)="confirm.emit()">{{ confirmText }}</button>
      </div>
    </app-modal>
  `,
  styles: [`
    .confirm-body {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }
    .confirm-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      background: var(--danger-bg);
      color: var(--danger-text);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--danger-border);
    }
    .confirm-message {
      font-size: 0.875rem;
      color: var(--slate-700);
      line-height: 1.5;
      margin: 0;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar acci&oacute;n';
  @Input() message = '&iquest;Est&aacute;s seguro de que deseas eliminar este registro?';
  @Input() confirmText = 'Eliminar';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}