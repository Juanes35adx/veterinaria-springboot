import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ConsultaService } from '../../core/services/api/consulta.service';
import { MascotaService } from '../../core/services/api/mascota.service';
import { VeterinarioService } from '../../core/services/api/veterinario.service';
import { DiagnosticoService } from '../../core/services/api/diagnostico.service';
import { PrescripcionService } from '../../core/services/api/prescripcion.service';
import { MedicamentoService } from '../../core/services/api/medicamento.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConsultaMedica, Mascota, Veterinario, Diagnostico, Prescripcion, Medicamento } from '../../core/models/models';
import { ModalComponent } from '../../shared/components/modal.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, ConfirmDialogComponent],
  template: `
    <div class="consultas-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Consultas M&eacute;dicas &amp; Expediente Cl&iacute;nico</h1>
          <p class="page-subtitle">Atenci&oacute;n veterinaria, diagn&oacute;sticos y prescripciones farmac&eacute;uticas</p>
        </div>
        <button type="button" class="btn btn-primary" (click)="abrirModalCrear()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nueva Consulta
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
            placeholder="Filtrar por paciente, motivo o m&eacute;dico veterinario..."
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
                <th>Fecha / Hora</th>
                <th>Paciente</th>
                <th>M&eacute;dico Veterinario</th>
                <th>Motivo de Consulta</th>
                <th>Signos Vitales</th>
                <th style="text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (c of consultasFiltradas(); track c.id) {
                <tr>
                  <td><span class="badge badge-neutral">#{{ c.id }}</span></td>
                  <td>
                    <span class="fecha-text">{{ formatFecha(c.fechaHora) }}</span>
                  </td>
                  <td>
                    <strong>{{ c.mascota?.nombre || 'Mascota #' + c.mascota?.id }}</strong>
                    <div class="text-xs text-muted">{{ c.mascota?.especie }} · {{ c.mascota?.raza }}</div>
                  </td>
                  <td>
                    <strong>{{ c.veterinario?.nombre || 'Veterinario' }}</strong>
                    <div class="text-xs text-muted">{{ c.veterinario?.especialidad }}</div>
                  </td>
                  <td>
                    <div class="motivo-cell">{{ c.motivo }}</div>
                  </td>
                  <td>
                    <div class="signos-pills">
                      <span class="badge badge-info">{{ c.pesoKg }} kg</span>
                      <span class="badge" [ngClass]="c.temperaturaC > 39.2 ? 'badge-danger' : 'badge-neutral'">
                        {{ c.temperaturaC }} &deg;C
                      </span>
                    </div>
                  </td>
                  <td style="text-align: right;">
                    <div class="action-buttons">
                      <button type="button" class="btn btn-primary btn-sm" (click)="abrirExpediente(c)" title="Ver expediente">
                        Expediente
                      </button>
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
                  <td colspan="7" class="text-center" style="padding: 2.5rem;">
                    No se encontraron consultas registradas.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      
      <app-modal
        [isOpen]="isModalOpen"
        [title]="modoEdicion ? 'Editar Consulta M&eacute;dica' : 'Registrar Consulta M&eacute;dica'"
        (close)="isModalOpen = false"
      >
        <form [formGroup]="consultaForm" (ngSubmit)="guardarConsulta()" id="consultaForm" body>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Paciente / Mascota *</label>
              <select class="form-control" formControlName="mascotaId">
                <option [ngValue]="null" disabled>Seleccionar paciente...</option>
                @for (m of mascotas; track m.id) {
                  <option [ngValue]="m.id">{{ m.nombre }} ({{ m.especie }} - Due&ntilde;o: {{ m.cliente?.nombre || 'N/A' }})</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">M&eacute;dico Veterinario *</label>
              <select class="form-control" formControlName="veterinarioId">
                <option [ngValue]="null" disabled>Seleccionar m&eacute;dico...</option>
                @for (v of veterinarios; track v.id) {
                  <option [ngValue]="v.id">{{ v.nombre }} ({{ v.especialidad }})</option>
                }
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Motivo de la Consulta *</label>
            <input type="text" class="form-control" formControlName="motivo" placeholder="Ej. Decaimiento, v&oacute;mito persistente...">
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Peso (kg) *</label>
              <input type="number" step="0.1" min="0.1" class="form-control" formControlName="pesoKg">
            </div>
            <div class="form-group">
              <label class="form-label">Temperatura (&deg;C) *</label>
              <input type="number" step="0.1" min="30" max="45" class="form-control" formControlName="temperaturaC">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Observaciones Cl&iacute;nicas</label>
            <textarea class="form-control" formControlName="observaciones" placeholder="Detalles del examen f&iacute;sico, evoluci&oacute;n..."></textarea>
          </div>
        </form>

        <div footer>
          <button type="button" class="btn btn-secondary" (click)="isModalOpen = false">Cancelar</button>
          <button type="submit" form="consultaForm" class="btn btn-primary" [disabled]="consultaForm.invalid || isSaving">
            {{ isSaving ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar Consulta') }}
          </button>
        </div>
      </app-modal>

      
      <app-modal
        [isOpen]="isExpedienteOpen"
        [title]="'Expediente Cl&iacute;nico · Consulta #' + (consultaActiva?.id || '')"
        maxWidth="780px"
        (close)="isExpedienteOpen = false"
      >
        <div body class="expediente-body">
          <div class="expediente-header-card">
            <div class="exp-patient">
              <div>
                <h3>{{ consultaActiva?.mascota?.nombre }}</h3>
                <span class="text-xs text-muted">
                  {{ consultaActiva?.mascota?.especie }} · {{ consultaActiva?.mascota?.raza }} ({{ consultaActiva?.mascota?.edad }} a&ntilde;os)
                </span>
              </div>
            </div>
            <div class="exp-vitals">
              <span><strong>Peso:</strong> {{ consultaActiva?.pesoKg }} kg</span>
              <span><strong>Temp:</strong> {{ consultaActiva?.temperaturaC }} &deg;C</span>
              <span><strong>M&eacute;dico:</strong> {{ consultaActiva?.veterinario?.nombre }}</span>
            </div>
          </div>
          <div class="exp-motivo-box">
            <strong>Motivo:</strong> {{ consultaActiva?.motivo }}
            @if (consultaActiva?.observaciones) {
              <div class="exp-obs"><strong>Observaciones:</strong> {{ consultaActiva?.observaciones }}</div>
            }
          </div>

          
          <div class="exp-section">
            <div class="exp-section-header">
              <h4>Diagn&oacute;sticos M&eacute;dicos ({{ diagnosticosConsulta.length }})</h4>
              <button type="button" class="btn btn-secondary btn-sm" (click)="toggleNuevoDiag()">
                {{ mostrarFormDiag ? 'Cancelar' : 'Agregar Diagn&oacute;stico' }}
              </button>
            </div>

            @if (mostrarFormDiag) {
              <form [formGroup]="diagForm" (ngSubmit)="guardarDiagnostico()" class="card-form-embedded">
                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label">Descripci&oacute;n del Diagn&oacute;stico *</label>
                    <input type="text" class="form-control" formControlName="descripcion" placeholder="Ej. Gastroenteritis bacteriana">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Gravedad *</label>
                    <select class="form-control" formControlName="gravedad">
                      <option value="Leve">Leve</option>
                      <option value="Moderada">Moderada</option>
                      <option value="Grave">Grave</option>
                      <option value="Crítica">Cr&iacute;tica</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Tratamiento Recomendado *</label>
                  <input type="text" class="form-control" formControlName="tratamiento" placeholder="Ej. Terapia antibi&oacute;tica + reposo">
                </div>
                <button type="submit" class="btn btn-primary btn-sm" [disabled]="diagForm.invalid">
                  Guardar Diagn&oacute;stico
                </button>
              </form>
            }

            <div class="diag-list">
              @for (d of diagnosticosConsulta; track d.id) {
                <div class="diag-card">
                  <div class="diag-top">
                    <strong>{{ d.descripcion }}</strong>
                    <span class="badge" [ngClass]="getGravedadClass(d.gravedad)">{{ d.gravedad }}</span>
                  </div>
                  <div class="diag-tratamiento">
                    <span>Tratamiento:</span> {{ d.tratamiento }}
                  </div>
                </div>
              } @empty {
                <p class="text-xs text-muted" style="text-align: center; padding: 0.75rem;">Sin diagn&oacute;sticos registrados a&uacute;n.</p>
              }
            </div>
          </div>

          
          <div class="exp-section">
            <div class="exp-section-header">
              <h4>Prescripciones &amp; Recetas Farmac&eacute;uticas ({{ prescripcionesConsulta.length }})</h4>
              <button type="button" class="btn btn-secondary btn-sm" (click)="toggleNuevaPresc()">
                {{ mostrarFormPresc ? 'Cancelar' : 'Recetar Medicamento' }}
              </button>
            </div>

            @if (mostrarFormPresc) {
              <form [formGroup]="prescForm" (ngSubmit)="guardarPrescripcion()" class="card-form-embedded">
                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label">Medicamento en Farmacia *</label>
                    <select class="form-control" formControlName="medicamentoId">
                      <option [ngValue]="null" disabled>Seleccionar medicamento...</option>
                      @for (m of medicamentos; track m.id) {
                        <option [ngValue]="m.id" [disabled]="m.stock <= 0">
                          {{ m.nombre }} (Stock: {{ m.stock }} u.) {{ m.stock <= 0 ? '- [AGOTADO]' : '' }}
                        </option>
                      }
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Cantidad a Recetar (Deduce Stock) *</label>
                    <input type="number" min="1" class="form-control" formControlName="cantidad">
                  </div>
                </div>

                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label">Dosis *</label>
                    <input type="text" class="form-control" formControlName="dosis" placeholder="Ej. 1 tableta cada 12 horas">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Duraci&oacute;n *</label>
                    <input type="text" class="form-control" formControlName="duracion" placeholder="Ej. 7 d&iacute;as">
                  </div>
                </div>

                <button type="submit" class="btn btn-primary btn-sm" [disabled]="prescForm.invalid">
                  Emitir Receta y Descontar Stock
                </button>
              </form>
            }

            <div class="presc-list">
              @for (p of prescripcionesConsulta; track p.id) {
                <div class="presc-card">
                  <div class="presc-info">
                    <strong>{{ p.medicamento?.nombre }}</strong>
                    <div class="text-xs text-muted">
                      Cantidad: <strong>{{ p.cantidad }}</strong> unidades · Dosis: {{ p.dosis }} · Duraci&oacute;n: {{ p.duracion }}
                    </div>
                  </div>
                  @if (authService.canDelete()) {
                    <button type="button" class="btn btn-danger btn-sm btn-icon" (click)="eliminarPrescripcion(p)" title="Eliminar receta y reintegrar stock">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  }
                </div>
              } @empty {
                <p class="text-xs text-muted" style="text-align: center; padding: 0.75rem;">No se han emitido recetas para esta consulta.</p>
              }
            </div>
          </div>
        </div>

        <div footer>
          <button type="button" class="btn btn-secondary" (click)="isExpedienteOpen = false">Cerrar Expediente</button>
        </div>
      </app-modal>

      
      <app-confirm-dialog
        [isOpen]="isConfirmOpen"
        title="Eliminar Consulta M&eacute;dica"
        message="&iquest;Est&aacute;s seguro de que deseas eliminar esta consulta m&eacute;dica? Los diagn&oacute;sticos y prescripciones asociadas deben ser revisados."
        (confirm)="confirmarEliminar()"
        (cancel)="isConfirmOpen = false"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .consultas-page {
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
    .fecha-text {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-main);
    }
    .motivo-cell {
      max-width: 220px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .signos-pills {
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
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
    .expediente-body {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .expediente-header-card {
      background: var(--primary-light);
      border: 1px solid #c8e6c9;
      border-left: 4px solid var(--primary);
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .exp-patient h3 {
      font-size: 1.125rem;
      color: var(--primary);
      margin: 0;
    }
    .exp-vitals {
      display: flex;
      gap: 1rem;
      font-size: 0.8125rem;
      color: var(--text-main);
    }
    .exp-motivo-box {
      font-size: 0.875rem;
      background: var(--bg-subtle);
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color);
    }
    .exp-obs {
      margin-top: 0.25rem;
      font-size: 0.8125rem;
      color: var(--text-main);
    }
    .exp-section {
      border-top: 1px solid var(--border-color);
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .exp-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .exp-section-header h4 {
      font-size: 0.9375rem;
      color: var(--text-main);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .card-form-embedded {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      padding: 1rem;
    }
    .diag-list, .presc-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .diag-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-left: 3px solid var(--primary);
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .diag-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .diag-tratamiento {
      font-size: 0.8125rem;
      color: var(--text-main);
    }
    .presc-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-left: 3px solid var(--accent-green);
      padding: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .text-xs { font-size: 0.75rem; }
    .text-muted { color: var(--text-muted); }
    .text-center { text-align: center; }
    @media (max-width: 640px) {
      .form-row-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class ConsultasComponent implements OnInit {
  authService = inject(AuthService);
  private consultaService = inject(ConsultaService);
  private mascotaService = inject(MascotaService);
  private veterinarioService = inject(VeterinarioService);
  private diagnosticoService = inject(DiagnosticoService);
  private prescripcionService = inject(PrescripcionService);
  private medicamentoService = inject(MedicamentoService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  consultas: ConsultaMedica[] = [];
  mascotas: Mascota[] = [];
  veterinarios: Veterinario[] = [];
  medicamentos: Medicamento[] = [];

  filtroTexto = '';
  isModalOpen = false;
  isSaving = false;
  modoEdicion = false;
  consultaEditandoId?: number;

  isExpedienteOpen = false;
  consultaActiva?: ConsultaMedica;
  diagnosticosConsulta: Diagnostico[] = [];
  prescripcionesConsulta: Prescripcion[] = [];
  mostrarFormDiag = false;
  mostrarFormPresc = false;

  isConfirmOpen = false;
  consultaAEliminar?: ConsultaMedica;

  consultaForm = this.fb.group({
    mascotaId: [null as number | null, Validators.required],
    veterinarioId: [null as number | null, Validators.required],
    motivo: ['', Validators.required],
    pesoKg: [5, [Validators.required, Validators.min(0.01)]],
    temperaturaC: [38.5, [Validators.required, Validators.min(30), Validators.max(45)]],
    observaciones: ['']
  });

  diagForm = this.fb.group({
    descripcion: ['', Validators.required],
    gravedad: ['Moderada', Validators.required],
    tratamiento: ['', Validators.required]
  });

  prescForm = this.fb.group({
    medicamentoId: [null as number | null, Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    dosis: ['', Validators.required],
    duracion: ['', Validators.required]
  });

  ngOnInit() {
    this.cargarCatalogos();
    this.cargarConsultas();

    this.route.queryParams.subscribe(params => {
      if (params['mascotaId']) {
        const mid = Number(params['mascotaId']);
        this.consultaService.listarPorMascota(mid).subscribe(list => {
          if (list.length > 0) {
            this.abrirExpediente(list[0]);
          }
        });
      }
    });
  }

  cargarCatalogos() {
    forkJoin({
      mascotas: this.mascotaService.listarTodas(),
      veterinarios: this.veterinarioService.listarTodos(),
      medicamentos: this.medicamentoService.listarTodos()
    }).subscribe({
      next: (res) => {
        this.mascotas = res.mascotas;
        this.veterinarios = res.veterinarios;
        this.medicamentos = res.medicamentos;
      },
      error: () => {}
    });
  }

  cargarConsultas() {
    this.consultaService.listarTodas().subscribe({
      next: (data) => { this.consultas = [...data].reverse(); },
      error: () => {}
    });
  }

  consultasFiltradas(): ConsultaMedica[] {
    if (!this.filtroTexto.trim()) return this.consultas;
    const txt = this.filtroTexto.toLowerCase();
    return this.consultas.filter(c =>
      (c.mascota?.nombre && c.mascota.nombre.toLowerCase().includes(txt)) ||
      (c.veterinario?.nombre && c.veterinario.nombre.toLowerCase().includes(txt)) ||
      c.motivo.toLowerCase().includes(txt)
    );
  }

  formatFecha(fechaStr?: string): string {
    if (!fechaStr) return 'Reciente';
    try {
      const d = new Date(fechaStr);
      return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return fechaStr;
    }
  }

  getGravedadClass(g: string): string {
    switch (g.toLowerCase()) {
      case 'leve': return 'badge-success';
      case 'moderada': return 'badge-warning';
      default: return 'badge-danger';
    }
  }

  abrirModalCrear() {
    this.modoEdicion = false;
    this.consultaEditandoId = undefined;
    this.consultaForm.reset({
      pesoKg: 5,
      temperaturaC: 38.5,
      mascotaId: null,
      veterinarioId: null
    });
    this.isModalOpen = true;
  }

  abrirModalEditar(c: ConsultaMedica) {
    this.modoEdicion = true;
    this.consultaEditandoId = c.id;
    this.consultaForm.patchValue({
      mascotaId: c.mascota?.id,
      veterinarioId: c.veterinario?.id,
      motivo: c.motivo,
      pesoKg: c.pesoKg,
      temperaturaC: c.temperaturaC,
      observaciones: c.observaciones || ''
    });
    this.isModalOpen = true;
  }

  guardarConsulta() {
    if (this.consultaForm.invalid) return;

    this.isSaving = true;
    const formVal = this.consultaForm.value;
    const payload: any = {
      mascota: { id: formVal.mascotaId },
      veterinario: { id: formVal.veterinarioId },
      motivo: formVal.motivo,
      pesoKg: formVal.pesoKg,
      temperaturaC: formVal.temperaturaC,
      observaciones: formVal.observaciones
    };

    if (this.modoEdicion && this.consultaEditandoId) {
      this.consultaService.actualizar(this.consultaEditandoId, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.isModalOpen = false;
          this.notificationService.success('Consulta actualizada correctamente');
          this.cargarConsultas();
        },
        error: () => { this.isSaving = false; }
      });
    } else {
      this.consultaService.crear(payload).subscribe({
        next: (nueva) => {
          this.isSaving = false;
          this.isModalOpen = false;
          this.notificationService.success('Consulta registrada exitosamente');
          this.cargarConsultas();
          this.abrirExpediente(nueva);
        },
        error: () => { this.isSaving = false; }
      });
    }
  }

  abrirExpediente(c: ConsultaMedica) {
    this.consultaActiva = c;
    this.mostrarFormDiag = false;
    this.mostrarFormPresc = false;
    this.cargarDetallesExpediente(c.id!);
    this.isExpedienteOpen = true;
  }

  cargarDetallesExpediente(consultaId: number) {
    this.diagnosticoService.listarPorConsulta(consultaId).subscribe({
      next: (diags) => { this.diagnosticosConsulta = diags; },
      error: () => {}
    });
    this.prescripcionService.listarPorConsulta(consultaId).subscribe({
      next: (prescs) => { this.prescripcionesConsulta = prescs; },
      error: () => {}
    });
  }

  toggleNuevoDiag() {
    this.mostrarFormDiag = !this.mostrarFormDiag;
    this.diagForm.reset({ gravedad: 'Moderada' });
  }

  guardarDiagnostico() {
    if (this.diagForm.invalid || !this.consultaActiva?.id) return;
    const val = this.diagForm.value;
    const payload = {
      consulta: { id: this.consultaActiva.id },
      descripcion: val.descripcion,
      gravedad: val.gravedad,
      tratamiento: val.tratamiento
    };

    this.diagnosticoService.crear(payload).subscribe({
      next: () => {
        this.notificationService.success('Diagnóstico registrado');
        this.mostrarFormDiag = false;
        this.cargarDetallesExpediente(this.consultaActiva!.id!);
      },
      error: () => {}
    });
  }

  toggleNuevaPresc() {
    this.mostrarFormPresc = !this.mostrarFormPresc;
    this.prescForm.reset({ cantidad: 1 });
  }

  guardarPrescripcion() {
    if (this.prescForm.invalid || !this.consultaActiva?.id) return;
    const val = this.prescForm.value;
    const payload = {
      consulta: { id: this.consultaActiva.id },
      medicamento: { id: val.medicamentoId },
      cantidad: val.cantidad,
      dosis: val.dosis,
      duracion: val.duracion
    };

    this.prescripcionService.crear(payload).subscribe({
      next: () => {
        this.notificationService.success('Receta emitida y stock de farmacia actualizado');
        this.mostrarFormPresc = false;
        this.cargarDetallesExpediente(this.consultaActiva!.id!);
        this.medicamentoService.listarTodos().subscribe(m => this.medicamentos = m);
      },
      error: () => {}
    });
  }

  eliminarPrescripcion(p: Prescripcion) {
    if (!p.id || !this.consultaActiva?.id) return;
    this.prescripcionService.eliminar(p.id).subscribe({
      next: () => {
        this.notificationService.success('Receta eliminada y unidades reintegradas al inventario');
        this.cargarDetallesExpediente(this.consultaActiva!.id!);
        this.medicamentoService.listarTodos().subscribe(m => this.medicamentos = m);
      },
      error: () => {}
    });
  }

  abrirModalEliminar(c: ConsultaMedica) {
    this.consultaAEliminar = c;
    this.isConfirmOpen = true;
  }

  confirmarEliminar() {
    if (!this.consultaAEliminar?.id) return;
    this.consultaService.eliminar(this.consultaAEliminar.id).subscribe({
      next: () => {
        this.notificationService.success('Consulta eliminada');
        this.isConfirmOpen = false;
        this.cargarConsultas();
      },
      error: () => { this.isConfirmOpen = false; }
    });
  }
}