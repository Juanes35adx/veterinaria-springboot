import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClienteService } from '../../core/services/api/cliente.service';
import { MascotaService } from '../../core/services/api/mascota.service';
import { ConsultaService } from '../../core/services/api/consulta.service';
import { MedicamentoService } from '../../core/services/api/medicamento.service';
import { AuthService } from '../../core/services/auth.service';
import { Medicamento, ConsultaMedica } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Panel de Control</h1>
          <p class="page-subtitle">Gesti&oacute;n y estado operativo de la cl&iacute;nica veterinaria</p>
        </div>
        <div class="role-badge-box">
          <span class="role-caption">Sesi&oacute;n:</span>
          <span class="badge" [ngClass]="getRoleClass(authService.userRole())">
            {{ authService.userRole() }}
          </span>
        </div>
      </div>

      
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-top-bar"></div>
          <div class="metric-content">
            <div class="metric-number">{{ totalClientes }}</div>
            <div class="metric-label">Clientes Registrados</div>
          </div>
          <div class="metric-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-top-bar"></div>
          <div class="metric-content">
            <div class="metric-number">{{ totalMascotas }}</div>
            <div class="metric-label">Pacientes / Mascotas</div>
          </div>
          <div class="metric-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <circle cx="6" cy="9" r="2"></circle>
              <circle cx="18" cy="9" r="2"></circle>
              <circle cx="9" cy="17" r="2"></circle>
              <circle cx="15" cy="17" r="2"></circle>
            </svg>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-top-bar"></div>
          <div class="metric-content">
            <div class="metric-number">{{ totalConsultas }}</div>
            <div class="metric-label">Consultas M&eacute;dicas</div>
          </div>
          <div class="metric-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
        </div>

        <div class="metric-card" [class.metric-has-alert]="medicamentosAlerta.length > 0">
          <div class="metric-top-bar" [style.background-color]="medicamentosAlerta.length > 0 ? '#dc2626' : '#006837'"></div>
          <div class="metric-content">
            <div class="metric-number" [class.text-danger]="medicamentosAlerta.length > 0">{{ medicamentosAlerta.length }}</div>
            <div class="metric-label">Insumos con Stock Bajo</div>
          </div>
          <div class="metric-icon-box" [class.icon-alert]="medicamentosAlerta.length > 0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        </div>
      </div>

      
      <div class="actions-strip card">
        <span class="actions-header">Accesos R&aacute;pidos:</span>
        <div class="actions-group">
          <a routerLink="/clientes" class="btn btn-secondary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo Cliente
          </a>
          <a routerLink="/mascotas" class="btn btn-secondary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Registrar Mascota
          </a>
          @if (authService.canManageClinic()) {
            <a routerLink="/consultas" class="btn btn-primary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              Iniciar Consulta
            </a>
          }
          <a routerLink="/medicamentos" class="btn btn-secondary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="14"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            Ver Farmacia
          </a>
        </div>
      </div>

      
      <div class="dashboard-columns">
        
        <div class="card">
          <div class="card-header">
            <h3>Alertas de Farmacia e Inventario</h3>
            <a routerLink="/medicamentos" class="btn btn-ghost btn-sm">Ver Cat&aacute;logo</a>
          </div>
          <div class="card-body">
            @if (medicamentosAlerta.length === 0) {
              <div class="empty-state">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#006837" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <p>Todo el inventario cuenta con stock &oacute;ptimo.</p>
              </div>
            } @else {
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Medicamento</th>
                      <th>Stock Actual</th>
                      <th>M&iacute;nimo</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (med of medicamentosAlerta; track med.id) {
                      <tr>
                        <td>
                          <strong>{{ med.nombre }}</strong>
                          <div class="text-xs text-muted">{{ med.principioActivo }} · {{ med.presentacion }}</div>
                        </td>
                        <td><strong>{{ med.stock }}</strong> unidades</td>
                        <td>{{ med.stockMinimo }} unidades</td>
                        <td>
                          @if (med.stock === 0) {
                            <span class="badge badge-danger">Agotado</span>
                          } @else {
                            <span class="badge badge-warning">Stock Cr&iacute;tico</span>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>

        
        <div class="card">
          <div class="card-header">
            <h3>Consultas Recientes</h3>
            @if (authService.canManageClinic()) {
              <a routerLink="/consultas" class="btn btn-ghost btn-sm">Ver Todas</a>
            }
          </div>
          <div class="card-body">
            @if (consultasRecientes.length === 0) {
              <div class="empty-state">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                <p>No hay consultas registradas a&uacute;n.</p>
              </div>
            } @else {
              <div class="consultas-feed">
                @for (c of consultasRecientes; track c.id) {
                  <div class="consulta-feed-item">
                    <div class="feed-main">
                      <div class="feed-top">
                        <strong class="feed-patient">{{ c.mascota?.nombre || 'Paciente' }}</strong>
                        <span class="feed-date">{{ formatFecha(c.fechaHora) }}</span>
                      </div>
                      <div class="feed-motive">{{ c.motivo }}</div>
                      <div class="feed-sub">
                        <span>Atendi&oacute;: {{ c.veterinario?.nombre || 'M&eacute;dico' }}</span>
                        <span>· Peso: {{ c.pesoKg }} kg</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      letter-spacing: -0.01em;
    }
    .page-subtitle {
      color: var(--text-muted);
      font-size: 0.8125rem;
      margin-top: 2px;
    }
    .role-badge-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--card-bg);
      padding: 0.375rem 0.75rem;
      border: 1px solid var(--border-color);
    }
    .role-caption {
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
    .metric-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      padding: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }
    .metric-top-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background-color: var(--primary);
    }
    .metric-content {
      display: flex;
      flex-direction: column;
    }
    .metric-number {
      font-family: var(--font-heading);
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.1;
    }
    .metric-label {
      font-size: 0.6875rem;
      color: var(--text-muted);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 4px;
    }
    .metric-icon-box {
      color: var(--primary);
      opacity: 0.8;
    }
    .icon-alert {
      color: #dc2626;
      opacity: 1;
    }
    .text-danger { color: #dc2626; }
    .actions-strip {
      padding: 0.875rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
      background: var(--card-bg);
      border-left: 4px solid var(--primary);
    }
    .actions-header {
      font-weight: 800;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-main);
    }
    .actions-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .dashboard-columns {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
      gap: 1.25rem;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1rem;
      color: var(--text-muted);
      gap: 0.5rem;
      text-align: center;
      font-size: 0.8125rem;
    }
    .text-xs { font-size: 0.75rem; }
    .text-muted { color: var(--text-muted); }
    .consultas-feed {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .consulta-feed-item {
      padding: 0.75rem;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-left: 3px solid var(--primary);
    }
    .feed-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }
    .feed-patient {
      font-size: 0.875rem;
      color: var(--text-main);
    }
    .feed-date {
      font-size: 0.6875rem;
      color: var(--slate-400);
    }
    .feed-motive {
      font-size: 0.8125rem;
      color: var(--slate-700);
      margin-bottom: 2px;
    }
    .feed-sub {
      font-size: 0.6875rem;
      color: var(--text-muted);
      display: flex;
      gap: 0.5rem;
    }
    @media (max-width: 640px) {
      .dashboard-columns { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private clienteService = inject(ClienteService);
  private mascotaService = inject(MascotaService);
  private consultaService = inject(ConsultaService);
  private medicamentoService = inject(MedicamentoService);

  totalClientes = 0;
  totalMascotas = 0;
  totalConsultas = 0;
  medicamentosAlerta: Medicamento[] = [];
  consultasRecientes: ConsultaMedica[] = [];

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    forkJoin({
      clientes: this.clienteService.listarTodos(),
      mascotas: this.mascotaService.listarTodas(),
      consultas: this.consultaService.listarTodas(),
      medicamentos: this.medicamentoService.listarTodos()
    }).subscribe({
      next: ({ clientes, mascotas, consultas, medicamentos }) => {
        this.totalClientes = clientes.length;
        this.totalMascotas = mascotas.length;
        this.totalConsultas = consultas.length;
        this.medicamentosAlerta = medicamentos.filter(m => m.stock <= m.stockMinimo);
        this.consultasRecientes = [...consultas].reverse().slice(0, 5);
      },
      error: () => {}
    });
  }

  getRoleClass(role: string | null): string {
    if (role === 'ADMIN') return 'badge-danger';
    if (role === 'VETERINARIO') return 'badge-info';
    return 'badge-success';
  }

  formatFecha(fechaStr?: string): string {
    if (!fechaStr) return 'Reciente';
    try {
      const d = new Date(fechaStr);
      return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return fechaStr;
    }
  }
}