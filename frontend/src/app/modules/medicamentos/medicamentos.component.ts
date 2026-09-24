import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MedicamentoService } from '../../core/services/api/medicamento.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Medicamento } from '../../core/models/models';
import { ModalComponent } from '../../shared/components/modal.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, ConfirmDialogComponent],
  template: `
    <div class="medicamentos-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Farmacia &amp; Control de Inventario</h1>
          <p class="page-subtitle">Cat&aacute;logo de medicamentos, existencias en almac&eacute;n y alertas de stock m&iacute;nimo</p>
        </div>
        @if (authService.canManageClinic()) {
          <button type="button" class="btn btn-primary" (click)="abrirModalCrear()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Registrar Medicamento
          </button>
        }
      </div>

      
      <div class="metrics-row">
        <div class="mini-card">
          <span class="mini-label">Total Productos</span>
          <span class="mini-val">{{ medicamentos.length }}</span>
        </div>
        <div class="mini-card" [class.alert-border]="medicamentosBajoStock.length > 0">
          <span class="mini-label">Stock Bajo / Cr&iacute;tico</span>
          <span class="mini-val text-warning">{{ medicamentosBajoStock.length }}</span>
        </div>
        <div class="mini-card" [class.danger-border]="medicamentosAgotados.length > 0">
          <span class="mini-label">Agotados (Stock 0)</span>
          <span class="mini-val text-danger">{{ medicamentosAgotados.length }}</span>
        </div>
      </div>

      
      <div class="card search-card">
        <div class="search-wrapper">
          <span class="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input
            type="text"
            class="form-control search-input"
            placeholder="Buscar por nombre comercial, principio activo o presentaci&oacute;n..."
            [(ngModel)]="filtroTexto"
          >
        </div>
      </div>

      
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Medicamento / Principio Activo</th>
                <th>Presentaci&oacute;n</th>
                <th>Precio Unitario</th>
                <th>Stock Disponible</th>
                <th>Stock M&iacute;nimo</th>
                <th>Estado</th>
                @if (authService.canManageClinic()) {
                  <th style="text-align: right;">Acciones</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (m of medicamentosFiltrados(); track m.id) {
                <tr [class.row-alert]="m.stock <= m.stockMinimo">
                  <td><span class="badge badge-neutral">#{{ m.id }}</span></td>
                  <td>
                    <strong>{{ m.nombre }}</strong>
                    <div class="text-xs text-muted">{{ m.principioActivo }}</div>
                  </td>
                  <td>{{ m.presentacion }}</td>
                  <td>
                    <span class="precio-tag">{{ formatMoneda(m.precio) }}</span>
                  </td>
                  <td>
                    <strong class="stock-num">{{ m.stock }}</strong> unidades
                  </td>
                  <td>{{ m.stockMinimo }} unidades</td>
                  <td>
                    @if (m.stock === 0) {
                      <span class="badge badge-danger">Agotado</span>
                    } @else if (m.stock <= m.stockMinimo) {
                      <span class="badge badge-warning">Stock Bajo</span>
                    } @else {
                      <span class="badge badge-success">Disponible</span>
                    }
                  </td>
                  @if (authService.canManageClinic()) {
                    <td style="text-align: right;">
                      <div class="action-buttons">
                        <button type="button" class="btn btn-secondary btn-sm btn-icon" (click)="abrirModalEditar(m)" title="Editar Stock / Precio">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                        @if (authService.canDelete()) {
                          <button type="button" class="btn btn-danger btn-sm btn-icon" (click)="abrirModalEliminar(m)" title="Eliminar (Solo Admin)">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        }
                      </div>
                    </td>
                  }
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="text-center" style="padding: 2.5rem;">
                    No se encontraron medicamentos en el inventario.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      
      <app-modal
        [isOpen]="isModalOpen"
        [title]="modoEdicion ? 'Editar Medicamento' : 'Registrar Nuevo Medicamento'"
        (close)="isModalOpen = false"
      >
        <form [formGroup]="medForm" (ngSubmit)="guardarMedicamento()" id="medForm" body>
          <div class="form-group">
            <label class="form-label">Nombre Comercial *</label>
            <input type="text" class="form-control" formControlName="nombre" placeholder="Ej. Amoxicilina 500mg">
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Principio Activo *</label>
              <input type="text" class="form-control" formControlName="principioActivo" placeholder="Ej. Amoxicilina">
            </div>
            <div class="form-group">
              <label class="form-label">Presentaci&oacute;n *</label>
              <input type="text" class="form-control" formControlName="presentacion" placeholder="Ej. Caja x 20 tabletas, Frasco 120ml...">
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Precio ($ COP) *</label>
              <input type="number" step="100" min="0" class="form-control" formControlName="precio">
            </div>
            <div class="form-group">
              <label class="form-label">Stock Actual *</label>
              <input type="number" min="0" class="form-control" formControlName="stock">
            </div>
            <div class="form-group">
              <label class="form-label">Stock M&iacute;nimo *</label>
              <input type="number" min="0" class="form-control" formControlName="stockMinimo">
            </div>
          </div>
        </form>

        <div footer>
          <button type="button" class="btn btn-secondary" (click)="isModalOpen = false">Cancelar</button>
          <button type="submit" form="medForm" class="btn btn-primary" [disabled]="medForm.invalid || isSaving">
            {{ isSaving ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>
      </app-modal>

      
      <app-confirm-dialog
        [isOpen]="isConfirmOpen"
        title="Eliminar Medicamento"
        [message]="'&iquest;Est&aacute;s seguro de que deseas eliminar ' + (medAEliminar?.nombre || '') + ' del cat&aacute;logo de farmacia?'"
        (confirm)="confirmarEliminar()"
        (cancel)="isConfirmOpen = false"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .medicamentos-page {
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
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .mini-card {
      background: var(--card-bg);
      padding: 1rem 1.25rem;
      border: 1px solid var(--border-color);
      border-left: 3px solid var(--primary);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .alert-border {
      border-left-color: #f59e0b;
      background: var(--warning-bg);
    }
    .danger-border {
      border-left-color: #dc2626;
      background: var(--danger-bg);
    }
    .mini-label {
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .mini-val {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
    }
    .text-warning { color: #b45309; }
    .text-danger { color: #b91c1c; }
    .search-card {
      padding: 0.75rem 1rem;
    }
    .precio-tag {
      font-weight: 700;
      color: var(--text-main);
    }
    .stock-num {
      font-size: 0.9375rem;
      color: var(--text-main);
    }
    .row-alert {
      background-color: var(--warning-bg);
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
    .form-row-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
    }
    .text-xs { font-size: 0.75rem; }
    .text-muted { color: var(--text-muted); }
    .text-center { text-align: center; }
    @media (max-width: 640px) {
      .form-row-2, .form-row-3 { grid-template-columns: 1fr; }
    }
  `]
})
export class MedicamentosComponent implements OnInit {
  authService = inject(AuthService);
  private medicamentoService = inject(MedicamentoService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  medicamentos: Medicamento[] = [];
  filtroTexto = '';

  isModalOpen = false;
  isSaving = false;
  modoEdicion = false;
  medEditandoId?: number;

  isConfirmOpen = false;
  medAEliminar?: Medicamento;

  medForm = this.fb.group({
    nombre: ['', Validators.required],
    principioActivo: ['', Validators.required],
    presentacion: ['', Validators.required],
    precio: [10000, [Validators.required, Validators.min(0)]],
    stock: [10, [Validators.required, Validators.min(0)]],
    stockMinimo: [5, [Validators.required, Validators.min(0)]]
  });

  get medicamentosBajoStock(): Medicamento[] {
    return this.medicamentos.filter(m => m.stock <= m.stockMinimo && m.stock > 0);
  }

  get medicamentosAgotados(): Medicamento[] {
    return this.medicamentos.filter(m => m.stock === 0);
  }

  ngOnInit() {
    this.cargarMedicamentos();
  }

  cargarMedicamentos() {
    this.medicamentoService.listarTodos().subscribe({
      next: (data) => { this.medicamentos = data; },
      error: () => {}
    });
  }

  medicamentosFiltrados(): Medicamento[] {
    if (!this.filtroTexto.trim()) return this.medicamentos;
    const txt = this.filtroTexto.toLowerCase();
    return this.medicamentos.filter(m =>
      m.nombre.toLowerCase().includes(txt) ||
      m.principioActivo.toLowerCase().includes(txt) ||
      m.presentacion.toLowerCase().includes(txt)
    );
  }

  formatMoneda(val: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  }

  abrirModalCrear() {
    this.modoEdicion = false;
    this.medEditandoId = undefined;
    this.medForm.reset({
      precio: 15000,
      stock: 20,
      stockMinimo: 5
    });
    this.isModalOpen = true;
  }

  abrirModalEditar(m: Medicamento) {
    this.modoEdicion = true;
    this.medEditandoId = m.id;
    this.medForm.patchValue({
      nombre: m.nombre,
      principioActivo: m.principioActivo,
      presentacion: m.presentacion,
      precio: m.precio,
      stock: m.stock,
      stockMinimo: m.stockMinimo
    });
    this.isModalOpen = true;
  }

  guardarMedicamento() {
    if (this.medForm.invalid) return;

    this.isSaving = true;
    const formVal = this.medForm.value;
    const payload: Medicamento = {
      nombre: formVal.nombre!,
      principioActivo: formVal.principioActivo!,
      presentacion: formVal.presentacion!,
      precio: Number(formVal.precio),
      stock: Number(formVal.stock),
      stockMinimo: Number(formVal.stockMinimo)
    };

    if (this.modoEdicion && this.medEditandoId) {
      this.medicamentoService.actualizar(this.medEditandoId, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.isModalOpen = false;
          this.notificationService.success('Medicamento actualizado correctamente');
          this.cargarMedicamentos();
        },
        error: () => { this.isSaving = false; }
      });
    } else {
      this.medicamentoService.crear(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.isModalOpen = false;
          this.notificationService.success('Medicamento registrado en el catálogo');
          this.cargarMedicamentos();
        },
        error: () => { this.isSaving = false; }
      });
    }
  }

  abrirModalEliminar(m: Medicamento) {
    this.medAEliminar = m;
    this.isConfirmOpen = true;
  }

  confirmarEliminar() {
    if (!this.medAEliminar?.id) return;
    this.medicamentoService.eliminar(this.medAEliminar.id).subscribe({
      next: () => {
        this.notificationService.success('Medicamento eliminado');
        this.isConfirmOpen = false;
        this.cargarMedicamentos();
      },
      error: () => { this.isConfirmOpen = false; }
    });
  }
}