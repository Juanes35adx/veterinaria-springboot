import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./modules/clientes/clientes.component').then(m => m.ClientesComponent)
      },
      {
        path: 'mascotas',
        loadComponent: () => import('./modules/mascotas/mascotas.component').then(m => m.MascotasComponent)
      },
      {
        path: 'consultas',
        loadComponent: () => import('./modules/consultas/consultas.component').then(m => m.ConsultasComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'VETERINARIO'] }
      },
      {
        path: 'medicamentos',
        loadComponent: () => import('./modules/medicamentos/medicamentos.component').then(m => m.MedicamentosComponent)
      },
      {
        path: 'veterinarios',
        loadComponent: () => import('./modules/veterinarios/veterinarios.component').then(m => m.VeterinariosComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./modules/usuarios/usuarios.component').then(m => m.UsuariosComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
