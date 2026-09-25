import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../core/services/api/usuario.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Usuario, Rol } from '../../core/models/models';
import { ModalComponent } from '../../shared/components/modal.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, ConfirmDialogComponent],
  template: `
    <div class="usuarios-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Gesti&oacute;n de Usuarios &amp; Accesos</h1>
          <p class="page-subtitle">Cuentas con credenciales en el sistema (Solo Administradores)</p>
        </div>
        <button type="button" class="btn btn-primary" (click)="abrirModalCrear()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nuevo Usuario
        </button>
      </div>

      
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de Usuario</th>
                <th>Nombre Completo</th>
                <th>Rol Asignado</th>
                <th style="text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (u of usuarios; track u.id) {
                <tr>
                  <td><span class="badge badge-neutral">#{{ u.id }}</span></td>
                  <td><strong>{{ u.username }}</strong></td>
                  <td>{{ u.nombreCompleto }}</td>
                  <td>
                    <span class="badge" [ngClass]="getRoleClass(u.rol)">{{ u.rol }}</span>
                  </td>
                  <td style="text-align: right;">
                    <button
                      type="button"
                      class="btn btn-danger btn-sm btn-icon"
                      (click)="abrirModalEliminar(u)"
                      [disabled]="u.username === authService.currentUser()?.username"
                      title="Eliminar usuario"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="text-center" style="padding: 2.5rem;">
                    No se encontraron usuarios registrados.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      
      <app-modal
        [isOpen]="isModalOpen"
        title="Crear Nuevo Usuario"
        (close)="isModalOpen = false"
      >
        <form [formGroup]="userForm" (ngSubmit)="guardarUsuario()" id="userForm" body>
          <div class="form-group">
            <label class="form-label">Nombre Completo *</label>
            <input type="text" class="form-control" formControlName="nombreCompleto" placeholder="Ej. Juan Pérez">
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Usuario (Login) *</label>
              <input type="text" class="form-control" formControlName="username" placeholder="Ej. jperez">
            </div>
            <div class="form-group">
              <label class="form-label">Rol del Sistema *</label>
              <select class="form-control" formControlName="rol">
                <option value="ADMIN">ADMIN (Acceso total)</option>
                <option value="VETERINARIO">VETERINARIO (&Aacute;rea cl&iacute;nica)</option>
                <option value="RECEPCIONISTA">RECEPCIONISTA (Mostrador)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Contrase&ntilde;a *</label>
            <input type="password" class="form-control" formControlName="password" placeholder="M&iacute;nimo 4 caracteres">
          </div>
        </form>

        <div footer>
          <button type="button" class="btn btn-secondary" (click)="isModalOpen = false">Cancelar</button>
          <button type="submit" form="userForm" class="btn btn-primary" [disabled]="userForm.invalid || isSaving">
            {{ isSaving ? 'Guardando...' : 'Crear Usuario' }}
          </button>
        </div>
      </app-modal>

      
      <app-confirm-dialog
        [isOpen]="isConfirmOpen"
        title="Eliminar Usuario"
        [message]="'&iquest;Est&aacute;s seguro de que deseas eliminar la cuenta ' + (userAEliminar?.username || '') + '?'"
        (confirm)="confirmarEliminar()"
        (cancel)="isConfirmOpen = false"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .usuarios-page {
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
    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .text-center { text-align: center; }
    @media (max-width: 640px) {
      .form-row-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class UsuariosComponent implements OnInit {
  authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  usuarios: Usuario[] = [];
  isModalOpen = false;
  isSaving = false;

  isConfirmOpen = false;
  userAEliminar?: Usuario;

  userForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4)]],
    rol: ['RECEPCIONISTA' as Rol, Validators.required],
    nombreCompleto: ['', Validators.required]
  });

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listarTodos().subscribe({
      next: (data) => { this.usuarios = data; },
      error: () => {}
    });
  }

  getRoleClass(rol: string): string {
    if (rol === 'ADMIN') return 'badge-danger';
    if (rol === 'VETERINARIO') return 'badge-info';
    return 'badge-success';
  }

  abrirModalCrear() {
    this.userForm.reset({ rol: 'RECEPCIONISTA' });
    this.isModalOpen = true;
  }

  guardarUsuario() {
    if (this.userForm.invalid) return;

    this.isSaving = true;
    const formVal = this.userForm.value;
    const payload: Usuario = {
      username: formVal.username!,
      password: formVal.password!,
      rol: formVal.rol!,
      nombreCompleto: formVal.nombreCompleto!
    };

    this.usuarioService.crear(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.isModalOpen = false;
        this.notificationService.success('Usuario creado exitosamente');
        this.cargarUsuarios();
      },
      error: () => { this.isSaving = false; }
    });
  }

  abrirModalEliminar(u: Usuario) {
    this.userAEliminar = u;
    this.isConfirmOpen = true;
  }

  confirmarEliminar() {
    if (!this.userAEliminar?.id) return;
    this.usuarioService.eliminar(this.userAEliminar.id).subscribe({
      next: () => {
        this.notificationService.success('Usuario eliminado');
        this.isConfirmOpen = false;
        this.cargarUsuarios();
      },
      error: () => { this.isConfirmOpen = false; }
    });
  }
}