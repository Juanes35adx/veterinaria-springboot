import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastComponent } from '../../shared/components/toast.component';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, ToastComponent],
  template: `
    <div class="app-layout">
      <app-navbar></app-navbar>
      <div class="layout-body">
        <app-sidebar></app-sidebar>
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-toast></app-toast>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-body);
      color: var(--text-main);
      transition: background-color 0.2s ease;
    }
    .layout-body {
      display: flex;
      flex: 1;
    }
    .content-area {
      flex: 1;
      padding: 1.5rem 1.75rem;
      max-width: 1440px;
      margin: 0 auto;
      width: 100%;
      overflow-y: auto;
    }
    @media (max-width: 640px) {
      .content-area { padding: 1rem; }
    }
  `]
})
export class MainLayoutComponent {}