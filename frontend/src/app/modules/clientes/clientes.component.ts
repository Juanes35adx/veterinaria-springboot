import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from '../../core/services/api/cliente.service';
import { MascotaService } from '../../core/services/api/mascota.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Cliente, Mascota } from '../../core/models/models';
import { ModalComponent } from '../../shared/components/modal.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, ConfirmDialogComponent],
  template: `
    <div class="clientes-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Clientes / Due&ntilde;os</h1>
          <p class="page-subtitle">Directorio de propietarios registrados en el sistema</p>
        </div>
        <button type="button" class="btn btn-primary" (click)="abrirModalCrear()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nuevo Cliente
        </button>
      </div>

      
      <div class="card search-card">
        <div class="search-wrapper">
          <span class="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input
            type="text"
            class="form-control search-input"
            placeholder="Buscar por nombre, tel&eacute;fono o correo..."
            [(ngModel)]="filtro"
          >
        </div>
      </div>

      
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Tel&eacute;fono</th>
                <th>Correo Electr&oacute;nico</th>
                <th>Pacientes</th>
                <th style="text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (c of clientesFiltrados(); track c.id) {
                <tr>
                  <td><span class="badge badge-neutral">#{{ c.id }}</span></td>
                  <td><strong>{{ c.nombre }}</strong></td>
                  <td>{{ c.telefono }}</td>
                  <td>{{ c.email }}</td>
                  <td>
                    <button type="button" class="btn btn-secondary btn-sm" (click)="verMascotas(c)">
                      Ver Mascotas
                    </button>
                  </td>
                  <td style="text-align: right;">
                    <div class="action-buttons">
                      <button type="button" class="btn btn-secondary btn-sm btn-icon" (click)="abrirModalEditar(c)" title="Editar">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      @if (authService.canDelete()) {
                        <button type="button" class="btn btn-danger btn-sm btn-icon" (click)="abrirModalEliminar(c)" title="Eliminar (Solo Admin)">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="text-center" style="padding: 2.5rem;">
                    No se encontraron clientes registrados.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      
      <app-modal
        [isOpen]="isModalOpen"
        [title]="modoEdicion ? 'Editar Cliente' : 'Registrar Nuevo Cliente'"
        (close)="cerrarModal()"
      >
        <form [formGroup]="clienteForm" (ngSubmit)="guardarCliente()" id="clienteForm" body>
          <div class="form-group">
            <label class="form-label">Nombre Completo *</label>
            <input type="text" class="form-control" formControlName="nombre" placeholder="Ej. Camila Restrepo">
            @if (clienteForm.get('nombre')?.touched && clienteForm.get('nombre')?.invalid) {
              <span class="field-error">El nombre es obligatorio.</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label">Tel&eacute;fono *</label>
            <input type="text" class="form-control" formControlName="telefono" placeholder="Ej. 3001234567">
            @if (clienteForm.get('telefono')?.touched && clienteForm.get('telefono')?.invalid) {
              <span class="field-error">El tel&eacute;fono es obligatorio.</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label">Correo Electr&oacute;nico *</label>
            <input type="email" class="form-control" formControlName="email" placeholder="Ej. camila@mail.com">
            @if (clienteForm.get('email')?.touched && clienteForm.get('email')?.invalid) {
              <span class="field-error">Ingrese un correo v&aacute;lido.</span>
            }
          </div>
        </form>

        <div footer>
          <button type="button" class="btn btn-secondary" (click)="cerrarModal()">Cancelar</button>
          <button type="submit" form="clienteForm" class="btn btn-primary" [disabled]="clienteForm.invalid || isSaving">
            {{ isSaving ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>
      </app-modal>

      
      <app-modal
        [isOpen]="isMascotasModalOpen"
        [title]="'Mascotas de ' + (clienteSeleccionado?.nombre || '')"
        (close)="isMascotasModalOpen = false"
      >
        <div body>
          @if (mascotasDelCliente.length === 0) {
            <p class="text-muted" style="text-align: center; padding: 1rem;">Este cliente no tiene mascotas registradas todav&iacute;a.</p>
          } @else {
            <div class="mascotas-list">
              @for (m of mascotasDelCliente; track m.id) {
                <div class="mascota-item">
                  <div class="mascota-info">
                    <h4>{{ m.nombre }}</h4>
                    <span class="badge badge-info">{{ m.especie }} · {{ m.raza }}</span>
                    <span class="text-xs text-muted">Edad: {{ m.edad }} a&ntilde;os</span>
                  </div>
                </div>
              }
            </div>
          }
        </div>
        <div footer>
          <button type="button" class="btn btn-secondary" (click)="isMascotasModalOpen = false">Cerrar</button>
        </div>
      </app-modal>

      
      <app-confirm-dialog
        [isOpen]="isConfirmOpen"
        title="Eliminar Cliente"
        [message]="'&iquest;Est&aacute;s seguro de que deseas eliminar al cliente ' + (clienteAEliminar?.nombre || '') + '? Si tiene mascotas registradas, la operaci&oacute;n ser&aacute; bloqueada por seguridad.'"
        (confirm)="confirmarEliminar()"
        (cancel)="isConfirmOpen = false"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .clientes-page {
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
      border-bottom: 1px solid var(--slate-200);
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
    .action-buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.375rem;
    }
    .field-error {
      font-size: 0.6875rem;
      color: var(--danger-text);
      margin-top: 0.25rem;
    }
    .mascotas-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .mascota-item {
      padding: 0.75rem 1rem;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-left: 3px solid var(--primary);
    }
    .mascota-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .mascota-info h4 {
      font-size: 0.9375rem;
      margin: 0;
      color: var(--text-main);
    }
    .text-xs { font-size: 0.75rem; }
    .text-muted { color: var(--text-muted); }
    .text-center { text-align: center; }
  `]
})
export class ClientesComponent implements OnInit {
  authService = inject(AuthService);
  private clienteService = inject(ClienteService);
  private mascotaService = inject(MascotaService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  clientes: Cliente[] = [];
  filtro = '';
  isModalOpen = false;
  isSaving = false;
  modoEdicion = false;
  clienteEditandoId?: number;

  isMascotasModalOpen = false;
  clienteSeleccionado?: Cliente;
  mascotasDelCliente: Mascota[] = [];

  isConfirmOpen = false;
  clienteAEliminar?: Cliente;

  clienteForm = this.fb.group({
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.listarTodos().subscribe({
      next: (data) => { this.clientes = data; },
      error: () => {}
    });
  }

  clientesFiltrados(): Cliente[] {
    if (!this.filtro.trim()) return this.clientes;
    const f = this.filtro.toLowerCase();
    return this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(f) ||
      c.telefono.toLowerCase().includes(f) ||
      c.email.toLowerCase().includes(f)
    );
  }

  abrirModalCrear() {
    this.modoEdicion = false;
    this.clienteEditandoId = undefined;
    this.clienteForm.reset();
    this.isModalOpen = true;
  }

  abrirModalEditar(cliente: Cliente) {
    this.modoEdicion = true;
    this.clienteEditandoId = cliente.id;
    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      email: cliente.email
    });
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  guardarCliente() {
    if (this.clienteForm.invalid) return;

    this.isSaving = true;
    const formVal = this.clienteForm.value;
    const payload: Cliente = {
      nombre: formVal.nombre!,
      telefono: formVal.telefono!,
      email: formVal.email!
    };

    if (this.modoEdicion && this.clienteEditandoId) {
      this.clienteService.actualizar(this.clienteEditandoId, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.isModalOpen = false;
          this.notificationService.success('Cliente actualizado correctamente');
          this.cargarClientes();
        },
        error: () => { this.isSaving = false; }
      });
    } else {
      this.clienteService.crear(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.isModalOpen = false;
          this.notificationService.success('Cliente registrado correctamente');
          this.cargarClientes();
        },
        error: () => { this.isSaving = false; }
      });
    }
  }

  verMascotas(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    if (!cliente.id) return;
    this.mascotaService.listarPorCliente(cliente.id).subscribe({
      next: (mascotas) => {
        this.mascotasDelCliente = mascotas;
        this.isMascotasModalOpen = true;
      },
      error: () => {}
    });
  }

  abrirModalEliminar(cliente: Cliente) {
    this.clienteAEliminar = cliente;
    this.isConfirmOpen = true;
  }

  confirmarEliminar() {
    if (!this.clienteAEliminar?.id) return;

    this.clienteService.eliminar(this.clienteAEliminar.id).subscribe({
      next: () => {
        this.notificationService.success('Cliente eliminado correctamente');
        this.isConfirmOpen = false;
        this.cargarClientes();
      },
      error: () => {
        this.isConfirmOpen = false;
      }
    });
  }
}