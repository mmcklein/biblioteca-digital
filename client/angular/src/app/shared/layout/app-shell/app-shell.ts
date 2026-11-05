import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { INSTITUTION } from '../../../core/institution';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  protected readonly institution = INSTITUTION;
  protected sidebarOpen = false;

  protected readonly nav = [
    { path: '/inicio', label: 'Inicio', icon: '🏠', ready: true },
    { path: '/acerca', label: 'Nuestra institución', icon: '🏫', ready: true },
    { path: '/areas', label: 'Áreas académicas', icon: '📚', ready: false },
    { path: '/libros', label: 'Biblioteca digital', icon: '📑', ready: false },
    { path: '/videos', label: 'Videos educativos', icon: '▶️', ready: false },
    { path: '/actividades', label: 'Actividades', icon: '📝', ready: false },
    { path: '/comunidad', label: 'Comunidad educativa', icon: '👥', ready: false },
    { path: '/galeria', label: 'Galería institucional', icon: '🖼️', ready: false },
  ];

  protected closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
