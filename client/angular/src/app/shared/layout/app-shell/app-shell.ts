import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { INSTITUTION } from '../../../core/institution';
import { ROLE_LABELS } from '../../../core/user.model';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  protected readonly auth = inject(AuthService);
  protected readonly institution = INSTITUTION;
  protected readonly roleLabels = ROLE_LABELS;
  protected sidebarOpen = false;

  private readonly baseNav = [
    { path: '/inicio', label: 'Inicio', icon: '🏠', ready: true },
    { path: '/acerca', label: 'Nuestra institución', icon: '🏫', ready: true },
    { path: '/areas', label: 'Áreas académicas', icon: '📚', ready: true },
    { path: '/grados', label: 'Por grado', icon: '🎓', ready: true },
    { path: '/libros', label: 'Biblioteca digital', icon: '📑', ready: true },
    { path: '/videos', label: 'Videos educativos', icon: '▶️', ready: true },
    { path: '/actividades', label: 'Actividades', icon: '📝', ready: true },
    { path: '/comunidad', label: 'Comunidad educativa', icon: '👥', ready: false },
    { path: '/galeria', label: 'Galería institucional', icon: '🖼️', ready: false },
  ];

  protected readonly nav = computed(() => {
    const list = [...this.baseNav];
    if (this.auth.isDocente() || this.auth.isAdmin()) {
      list.push({ path: '/docente', label: 'Panel Docente', icon: '🧑‍🏫', ready: true });
    }
    if (this.auth.isAdmin()) {
      list.push({ path: '/admin', label: 'Administración', icon: '⚙️', ready: true });
    }
    if (this.auth.isEstudiante()) {
      list.push({ path: '/estudiante', label: 'Mi Espacio Escolar', icon: '🎓', ready: true });
    }
    if (this.auth.isPadre()) {
      list.push({ path: '/padre', label: 'Espacio Familiar', icon: '👨‍👩‍👧', ready: true });
    }
    if (this.auth.isAuthenticated()) {
      list.push({ path: '/perfil', label: 'Mi Perfil', icon: '👤', ready: true });
    }
    return list;
  });

  protected closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
