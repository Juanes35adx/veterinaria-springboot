import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MascotaService } from '../../core/services/api/mascota.service';
import { ClienteService } from '../../core/services/api/cliente.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Mascota, Cliente, MascotaRequest } from '../../core/models/models';
import { ModalComponent } from '../../shared/components/modal.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-mascotas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ModalComponent, ConfirmDialogComponent],
  template: `
    <div class="mascotas-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Pacientes / Mascotas</h1>
          <p class="page-subtitle">Registro y expedientes cl&iacute;nicos de los pacientes</p>
        </div>
        <button type="button" class="btn btn-primary" (click)="abrirModalCrear()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Registrar Mascota
        </button>
      </div>

      
      <div class="card search-card">
        <div class="filters-row">
          <div class="search-wrapper search-flex">
            <span class="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              type="text"
              class="form-control search-input"
              placeholder="Buscar por nombre, raza o due&ntilde;o..."
              [(ngModel)]="filtroTexto"
            >
          </div>
          <div class="species-filter">
            <button
              type="button"
              class="btn btn-sm"
              [ngClass]="filtroEspecie === '' ? 'btn-primary' : 'btn-secondary'"
              (click)="filtroEspecie = ''"
            >
              Todas
            </button>
            <button
              type="button"
              class="btn btn-sm"
              [ngClass]="filtroEspecie === 'Perro' ? 'btn-primary' : 'btn-secondary'"
              (click)="filtroEspecie = 'Perro'"
            >
              Caninos
            </button>
            <button
              type="button"
              class="btn btn-sm"
              [ngClass]="filtroEspecie === 'Gato' ? 'btn-primary' : 'btn-secondary'"
              (click)="filtroEspecie = 'Gato'"
            >
              Felinos
            </button>
            <button
              type="button"
              class="btn btn-sm"
              [ngClass]="filtroEspecie === 'Otro' ? 'btn-primary' : 'btn-secondary'"
              (click)="filtroEspecie = 'Otro'"
            >
              Otras Especies
            </button>
          </div>
        </div>
      </div>

      
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Paciente</th>
                <th>Especie / Raza</th>
                <th>Edad</th>
                <th>Due&ntilde;o / Propietario</th>
                <th style="text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (m of mascotasFiltradas(); track m.id) {
                <tr>
                  <td><span class="badge badge-neutral">#{{ m.id }}</span></td>
                  <td>
                    <strong>{{ m.nombre }}</strong>
                  </td>
                  <td>
                    <span class="badge badge-info">{{ m.especie }}</span>
                    <span class="breed-text">{{ m.raza }}</span>
                  </td>
                  <td>{{ m.edad }} {{ m.edad === 1 ? 'a&ntilde;o' : 'a&ntilde;os' }}</td>
                  <td>
                    <strong>{{ m.cliente?.nombre || 'Sin asignar' }}</strong>
                    <div class="text-xs text-muted">{{ m.cliente?.telefono }}</div>
                  </td>
                  <td style="text-align: right;">
                    <div class="action-buttons">
                      @if (authService.canManageClinic()) {
                        <a [routerLink]="['/consultas']" [queryParams]="{ mascotaId: m.id }" class="btn btn-secondary btn-sm" title="Historial Cl&iacute;nico">
                          Historial
                        </a>
                      }
                      <button type="button" class="btn btn-secondary btn-sm btn-icon" (click)="abrirModalEditar(m)" title="Editar">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      @if (authService.canDelete()) {
                        <button type="button" class="btn btn-danger btn-sm btn-icon" (click)="abrirModalEliminar(m)" title="Eliminar (Solo Admin)">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="text-center" style="padding: 2.5rem;">
                    No se encontraron mascotas registradas con los filtros actuales.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      
      <app-modal
        [isOpen]="isModalOpen"
        [title]="modoEdicion ? 'Editar Mascota' : 'Registrar Nueva Mascota'"
        (close)="cerrarModal()"
      >
        <form [formGroup]="mascotaForm" (ngSubmit)="guardarMascota()" id="mascotaForm" body>
          <div class="form-group">
            <label class="form-label">Nombre de la Mascota *</label>
            <input type="text" class="form-control" formControlName="nombre" placeholder="Ej. Firulais">
            @if (mascotaForm.get('nombre')?.touched && mascotaForm.get('nombre')?.invalid) {
              <span class="field-error">El nombre es requerido.</span>
            }
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Especie *</label>
              <select class="form-control" formControlName="especie">
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Conejo">Conejo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Raza *</label>
              <input type="text" class="form-control" formControlName="raza" placeholder="Ej. Labrador, Criollo...">
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Edad (a&ntilde;os) *</label>
              <input type="number" min="0" max="40" class="form-control" formControlName="edad">
            </div>
            <div class="form-group">
              <label class="form-label">Due&ntilde;o / Cliente *</label>
              <select class="form-control" formControlName="clienteId">
                <option [ngValue]="null" disabled>Seleccionar due&ntilde;o...</option>
                @for (c of clientes; track c.id) {
                  <option [ngValue]="c.id">{{ c.nombre }} ({{ c.telefono }})</option>
                }
              </select>
              @if (mascotaForm.get('clienteId')?.touched && mascotaForm.get('clienteId')?.invalid) {
                <span class="field-error">Debe seleccionar un cliente registrado.</span>
              }
            </div>
          </div>
        </form>

        <div footer>
          <button type="button" class="btn btn-secondary" (click)="cerrarModal()">Cancelar</button>
          <button type="submit" form="mascotaForm" class="btn btn-primary" [disabled]="mascotaForm.invalid || isSaving">
            {{ isSaving ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>
      </app-modal>

      
      <app-confirm-dialog
        [isOpen]="isConfirmOpen"
        title="Eliminar Mascota"
        [message]="'&iquest;Est&aacute;s seguro de que deseas eliminar a la mascota ' + (mascotaAEliminar?.nombre || '') + '? Si tiene consultas cl&iacute;nicas, la acci&oacute;n ser&aacute; bloqueada por seguridad.'"
        (confirm)="confirmarEliminar()"
        (cancel)="isConfirmOpen = false"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .mascotas-page {
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
    .search-card {
      padding: 0.75rem 1rem;
    }
    .filters-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .search-flex {
      flex: 1;
      min-width: 260px;
    }
    .species-filter {
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
    }
    .breed-text {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-left: 0.375rem;
    }
    .action-buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.375rem;
    }
    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .field-error {
      font-size: 0.6875rem;
      color: var(--danger-text);
      margin-top: 0.25rem;
    }
    .text-xs { font-size: 0.75rem; }
    .text-muted { color: var(--text-muted); }
    .text-center { text-align: center; }
    @media (max-width: 640px) {
      .form-row-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class MascotasComponent implements OnInit {
  authService = inject(AuthService);
  private mascotaService = inject(MascotaService);
  private clienteService = inject(ClienteService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  mascotas: Mascota[] = [];
  clientes: Cliente[] = [];
  filtroTexto = '';
  filtroEspecie = '';

  isModalOpen = false;
  isSaving = false;
  modoEdicion = false;
  mascotaEditandoId?: number;

  isConfirmOpen = false;
  mascotaAEliminar?: Mascota;

  mascotaForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    especie: ['Perro', Validators.required],
    raza: ['', Validators.required],
    edad: [1, [Validators.required, Validators.min(0)]],
    clienteId: [null as number | null, Validators.required]
  });

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.mascotaService.listarTodas().subscribe({
      next: (data) => { this.mascotas = data; },
      error: () => {}
    });
    this.clienteService.listarTodos().subscribe({
      next: (data) => { this.clientes = data; },
      error: () => {}
    });
  }

  mascotasFiltradas(): Mascota[] {
    return this.mascotas.filter(m => {
      const matchEspecie = !this.filtroEspecie || 
        (this.filtroEspecie === 'Otro' ? !['Perro', 'Gato'].includes(m.especie) : m.especie === this.filtroEspecie);
      
      const txt = this.filtroTexto.toLowerCase();
      const matchTexto = !this.filtroTexto.trim() ||
        m.nombre.toLowerCase().includes(txt) ||
        m.raza.toLowerCase().includes(txt) ||
        (m.cliente?.nombre && m.cliente.nombre.toLowerCase().includes(txt));

      return matchEspecie && matchTexto;
    });
  }

  abrirModalCrear() {
    this.modoEdicion = false;
    this.mascotaEditandoId = undefined;
    this.mascotaForm.reset({
      especie: 'Perro',
      edad: 1,
      clienteId: null
    });
    this.isModalOpen = true;
  }

  abrirModalEditar(mascota: Mascota) {
    this.modoEdicion = true;
    this.mascotaEditandoId = mascota.id;
    this.mascotaForm.patchValue({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza,
      edad: mascota.edad,
      clienteId: mascota.cliente?.id || null
    });
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  guardarMascota() {
    const formVal = this.mascotaForm.getRawValue();
    if (this.mascotaForm.invalid || formVal.clienteId === null) return;

    this.isSaving = true;
    const payload: MascotaRequest = {
      nombre: formVal.nombre,
      especie: formVal.especie,
      raza: formVal.raza,
      edad: formVal.edad,
      cliente: { id: formVal.clienteId }
    };

    if (this.modoEdicion && this.mascotaEditandoId) {
      this.mascotaService.actualizar(this.mascotaEditandoId, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.isModalOpen = false;
          this.notificationService.success('Mascota actualizada correctamente');
          this.cargarDatos();
        },
        error: () => { this.isSaving = false; }
      });
    } else {
      this.mascotaService.crear(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.isModalOpen = false;
          this.notificationService.success('Mascota registrada correctamente');
          this.cargarDatos();
        },
        error: () => { this.isSaving = false; }
      });
    }
  }

  abrirModalEliminar(mascota: Mascota) {
    this.mascotaAEliminar = mascota;
    this.isConfirmOpen = true;
  }

  confirmarEliminar() {
    if (!this.mascotaAEliminar?.id) return;

    this.mascotaService.eliminar(this.mascotaAEliminar.id).subscribe({
      next: () => {
        this.notificationService.success('Mascota eliminada correctamente');
        this.isConfirmOpen = false;
        this.cargarDatos();
      },
      error: () => {
        this.isConfirmOpen = false;
      }
    });
  }
}