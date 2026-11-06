import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { CatalogService } from '../../core/catalog.service';
import { CURRICULAR_AREAS } from '../../core/curriculum';
import { ROLE_LABELS } from '../../core/user.model';
import { ActivityDetail } from '../actividades/activity-detail/activity-detail';
import { ResourceCard } from '../catalogo/resource-card/resource-card';
import { ResourceDetail } from '../catalogo/resource-detail/resource-detail';
import { Perfil } from '../perfil/perfil';
import type { LibraryResource } from '../../core/resources';

type Tab = 'catalogo' | 'actividades' | 'perfil';

@Component({
  selector: 'app-estudiante',
  imports: [FormsModule, ResourceCard, ResourceDetail, ActivityDetail, Perfil],
  templateUrl: './estudiante.html',
  styleUrl: './estudiante.scss',
})
export class Estudiante {
  protected readonly auth = inject(AuthService);
  protected readonly catalog = inject(CatalogService);
  protected readonly areas = CURRICULAR_AREAS;
  protected readonly roleLabels = ROLE_LABELS;

  protected activeTab = signal<Tab>('catalogo');
  protected searchQ = signal('');
  protected filterArea = signal('');

  protected selectedResource = signal<LibraryResource | null>(null);
  protected selectedActivity = signal<LibraryResource | null>(null);

  protected readonly userGrade = computed(() => this.auth.currentUser()?.grade ?? null);

  // Catálogo publicado para el grado del estudiante (excluye actividades, que van en su pestaña)
  protected readonly gradeCatalog = computed(() => {
    const grade = this.userGrade();
    const q = this.searchQ().toLowerCase().trim();
    const area = this.filterArea();
    return this.catalog.allResourcesList().filter((r) => {
      if (r.status !== 'publicado') return false;
      if (r.type === 'Actividad') return false;
      if (grade !== null && r.assignedGrades && r.assignedGrades.length > 0) {
        if (!r.assignedGrades.includes(grade)) return false;
      }
      if (area && r.areaId !== undefined && String(r.areaId) !== area) return false;
      if (q && !r.title.toLowerCase().includes(q) && !(r.description ?? '').toLowerCase().includes(q)) return false;
      return true;
    });
  });

  // Actividades publicadas y asignadas al grado del estudiante
  protected readonly assignedActivities = computed(() => {
    const grade = this.userGrade();
    const q = this.searchQ().toLowerCase().trim();
    return this.catalog.allResourcesList().filter((r) => {
      if (r.status !== 'publicado') return false;
      if (r.type !== 'Actividad') return false;
      if (grade !== null && r.assignedGrades && r.assignedGrades.length > 0) {
        if (!r.assignedGrades.includes(grade)) return false;
      }
      if (q && !r.title.toLowerCase().includes(q) && !(r.description ?? '').toLowerCase().includes(q)) return false;
      return true;
    });
  });

  protected setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  protected openResource(r: LibraryResource): void {
    this.selectedResource.set(r);
  }

  protected closeResource(): void {
    this.selectedResource.set(null);
  }

  protected openActivity(r: LibraryResource): void {
    this.selectedActivity.set(r);
  }

  protected closeActivity(): void {
    this.selectedActivity.set(null);
  }
}

