import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    const saved = localStorage.getItem('protozoo-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = saved ? saved === 'dark' : prefersDark;
    this.setDarkMode(initialDark);
  }

  toggleTheme(): void {
    this.setDarkMode(!this.isDarkMode());
  }

  setDarkMode(dark: boolean): void {
    this.isDarkMode.set(dark);
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('protozoo-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('protozoo-theme', 'light');
    }
  }
}