import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { CatalogService } from '../../core/catalog.service';
import { CURRICULAR_AREAS } from '../../core/curriculum';
import { ROLE_LABELS } from '../../core/user.model';
import { ResourceCard } from '../catalogo/resource-card/resource-card';
import { ResourceDetail } from '../catalogo/resource-detail/resource-detail';
import { VideoPlayer } from '../videos/video-player/video-player';
import { Perfil } from '../perfil/perfil';
import type { LibraryResource } from '../../core/resources';

type Tab = 'catalogo' | 'perfil';

@Component({
  selector: 'app-padre',
  imports: [FormsModule, ResourceCard, ResourceDetail, VideoPlayer, Perfil],
  templateUrl: './padre.html',
  styleUrl: './padre.scss',
})
export class Padre {
  protected readonly auth = inject(AuthService);
  protected readonly catalog = inject(CatalogService);
  protected readonly areas = CURRICULAR_AREAS;
  protected readonly roleLabels = ROLE_LABELS;

  protected activeTab = signal<Tab>('catalogo');
  protected searchQ = signal('');
  protected filterArea = signal('');
  protected filterGrade = signal('');
  protected filterType = signal('');

  protected selectedResource = signal<LibraryResource | null>(null);
  protected selectedVideo = signal<LibraryResource | null>(null);

  protected readonly GRADES = [1, 2, 3, 4, 5];

  // Catálogo familiar: solo materiales publicados (libros, guías, videos).
  // Restricción: No incluye actividades pedagógicas para resolución.
  protected readonly familyCatalog = computed(() => {
    const q = this.searchQ().toLowerCase().trim();
    const area = this.filterArea();
    const grade = this.filterGrade();
    const type = this.filterType();

    return this.catalog.allResourcesList().filter((r) => {
      if (r.status !== 'publicado') return false;
      if (r.type === 'Actividad') return false; // Restricción estricta
      if (area && r.areaId !== undefined && String(r.areaId) !== area) return false;
      if (grade && r.assignedGrades && r.assignedGrades.length > 0) {
        if (!r.assignedGrades.includes(Number(grade))) return false;
      }
      if (type && r.type !== type) return false;
      if (q && !r.title.toLowerCase().includes(q) && !(r.description ?? '').toLowerCase().includes(q)) return false;
      return true;
    });
  });

  protected setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  protected openResource(r: LibraryResource): void {
    if (r.type === 'Video') {
      this.selectedVideo.set(r);
    } else {
      this.selectedResource.set(r);
    }
  }

  protected closeResource(): void {
    this.selectedResource.set(null);
  }

  protected closeVideo(): void {
    this.selectedVideo.set(null);
  }
}

