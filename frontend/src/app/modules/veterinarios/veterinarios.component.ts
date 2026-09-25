import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { VeterinarioService } from '../../core/services/api/veterinario.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Veterinario } from '../../core/models/models';
import { ModalComponent } from '../../shared/components/modal.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-veterinarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, ConfirmDialogComponent],
  template: `
    <div class="veterinarios-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Cuerpo M&eacute;dico Veterinario</h1>
          <p class="page-subtitle">Personal facultativo autorizado para consultas y recetas</p>
        </div>
        @if (authService.isAdmin()) {
          <button type="button" class="btn btn-primary" (click)="abrirModalCrear()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Registrar M&eacute;dico
          </button>
        }
      </div>

      
      <div class="vets-grid">
        @for (v of veterinarios; track v.id) {
          <div class="card vet-card">
            <div class="vet-top">
              <div class="vet-icon-sq">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
              </div>
              <div class="vet-meta">
                <h3 class="vet-name">{{ v.nombre }}</h3>
                <span class="badge badge-info">{{ v.especialidad }}</span>
              </div>
            </div>

            <div class="vet-details">
              <div class="detail-row">
                <span class="detail-label">Tarjeta Profesional:</span>
                <span class="detail-val">{{ v.tarjetaProfesional }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tel&eacute;fono:</span>
                <span class="detail-val">{{ v.telefono }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Correo:</span>
                <span class="detail-val">{{ v.email }}</span>
              </div>
            </div>

            @if (authService.isAdmin()) {
              <div class="vet-actions">
                <button type="button" class="btn btn-secondary btn-sm" (click)="abrirModalEditar(v)">
                  Editar
                </button>
                <button type="button" class="btn btn-danger btn-sm" (click)="abrirModalEliminar(v)">
                  Eliminar
                </button>
              </div>
            }
          </div>
        } @empty {
          <div class="card empty-card">
            <p>No hay veterinarios registrados en el sistema.</p>
          </div>
        }
      </div>

      
      <app-modal
        [isOpen]="isModalOpen"
        [title]="modoEdicion ? 'Editar Veterinario' : 'Registrar Nuevo Veterinario'"
        (close)="isModalOpen = false"
      >
        <form [formGroup]="vetForm" (ngSubmit)="guardarVeterinario()" id="vetForm" body>
          <div class="form-group">
            <label class="form-label">Nombre Completo *</label>
            <input type="text" class="form-control" formControlName="nombre" placeholder="Ej. Dr. Carlos Gómez">
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Tarjeta Profesional *</label>
              <input type="text" class="form-control" formControlName="tarjetaProfesional" placeholder="Ej. TP-88492">
            </div>
            <div class="form-group">
              <label class="form-label">Especialidad *</label>
              <input type="text" class="form-control" formControlName="especialidad" placeholder="Ej. Cirugía, General, Dermatología...">
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Tel&eacute;fono *</label>
              <input type="text" class="form-control" formControlName="telefono" placeholder="Ej. 3109876543">
            </div>
            <div class="form-group">
              <label class="form-label">Correo Electr&oacute;nico *</label>
              <input type="email" class="form-control" formControlName="email" placeholder="Ej. carlos@vet.com">
            </div>
          </div>
        </form>

        <div footer>
          <button type="button" class="btn btn-secondary" (click)="isModalOpen = false">Cancelar</button>
          <button type="submit" form="vetForm" class="btn btn-primary" [disabled]="vetForm.invalid || isSaving">
            {{ isSaving ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>
      </app-modal>

      
      <app-confirm-dialog
        [isOpen]="isConfirmOpen"
        title="Eliminar Veterinario"
        [message]="'&iquest;Est&aacute;s seguro de que deseas eliminar al m&eacute;dico ' + (vetAEliminar?.nombre || '') + '?'"
        (confirm)="confirmarEliminar()"
        (cancel)="isConfirmOpen = false"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .veterinarios-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
    }
    .page-title {
      font-size: 1.625rem;
      font-weight: 800;
      color: var(--primary);
      text-transform: uppercase;
    }
    .page-subtitle {
      color: var(--text-muted);
      font-size: 0.8125rem;
      margin-top: 2px;
    }
    .vets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }
    .vet-card {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.125rem;
      border-top: 3px solid var(--primary);
    }
    .vet-top {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }
    .vet-icon-sq {
      width: 44px;
      height: 44px;
      background: var(--primary-light);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .vet-meta {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .vet-name {
      font-size: 1.0625rem;
      margin: 0;
      color: var(--text-main);
    }
    .vet-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background: var(--bg-subtle);
      padding: 0.75rem;
      border: 1px solid var(--border-color);
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.8125rem;
    }
    .detail-label {
      color: var(--text-muted);
      font-weight: 600;
    }
    .detail-val {
      font-weight: 700;
      color: var(--text-main);
    }
    .vet-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .empty-card {
      grid-column: 1 / -1;
      padding: 3rem;
      text-align: center;
      color: var(--text-muted);
    }
    @media (max-width: 640px) {
      .form-row-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class VeterinariosComponent implements OnInit {
  authService = inject(AuthService);
  private vetService = inject(VeterinarioService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  veterinarios: Veterinario[] = [];
  isModalOpen = false;
  isSaving = false;
  modoEdicion = false;
  vetEditandoId?: number;

  isConfirmOpen = false;
  vetAEliminar?: Veterinario;

  vetForm = this.fb.group({
    nombre: ['', Validators.required],
    tarjetaProfesional: ['', Validators.required],
    especialidad: ['', Validators.required],
    telefono: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    this.cargarVeterinarios();
  }

  cargarVeterinarios() {
    this.vetService.listarTodos().subscribe({
      next: (data) => { this.veterinarios = data; },
      error: () => {}
    });
  }

  abrirModalCrear() {
    this.modoEdicion = false;
    this.vetEditandoId = undefined;
    this.vetForm.reset();
    this.isModalOpen = true;
  }

  abrirModalEditar(v: Veterinario) {
    this.modoEdicion = true;
    this.vetEditandoId = v.id;
    this.vetForm.patchValue({
      nombre: v.nombre,
      tarjetaProfesional: v.tarjetaProfesional,
      especialidad: v.especialidad,
      telefono: v.telefono,
      email: v.email
    });
    this.isModalOpen = true;
  }

  guardarVeterinario() {
    if (this.vetForm.invalid) return;

    this.isSaving = true;
    const formVal = this.vetForm.value;
    const payload: Veterinario = {
      nombre: formVal.nombre!,
      tarjetaProfesional: formVal.tarjetaProfesional!,
      especialidad: formVal.especialidad!,
      telefono: formVal.telefono!,
      email: formVal.email!
    };

    if (this.modoEdicion && this.vetEditandoId) {
      this.vetService.actualizar(this.vetEditandoId, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.isModalOpen = false;
          this.notificationService.success('Veterinario actualizado correctamente');
          this.cargarVeterinarios();
        },
        error: () => { this.isSaving = false; }
      });
    } else {
      this.vetService.crear(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.isModalOpen = false;
          this.notificationService.success('Veterinario registrado con éxito');
          this.cargarVeterinarios();
        },
        error: () => { this.isSaving = false; }
      });
    }
  }

  abrirModalEliminar(v: Veterinario) {
    this.vetAEliminar = v;
    this.isConfirmOpen = true;
  }

  confirmarEliminar() {
    if (!this.vetAEliminar?.id) return;
    this.vetService.eliminar(this.vetAEliminar.id).subscribe({
      next: () => {
        this.notificationService.success('Veterinario eliminado');
        this.isConfirmOpen = false;
        this.cargarVeterinarios();
      },
      error: () => { this.isConfirmOpen = false; }
    });
  }
}