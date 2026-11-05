import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { CatalogService, EMPTY_ACTIVITY_FILTERS, type ActivityFilters } from '../../core/catalog.service';
import { CURRICULAR_AREAS, GRADES, areaById, gradeLabel } from '../../core/curriculum';
import type { LibraryResource } from '../../core/resources';
import { ActivityDetail } from './activity-detail/activity-detail';

@Component({
  selector: 'app-actividades',
  imports: [ActivityDetail],
  templateUrl: './actividades.html',
  styleUrl: './actividades.scss',
})
export class Actividades {
  private readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly areas = CURRICULAR_AREAS;
  protected readonly grades = GRADES;
  protected readonly gradeLabel = gradeLabel;
  protected readonly areaById = areaById;
  protected readonly queryDraft = signal('');
  protected selectedActivity: LibraryResource | null = null;

  protected readonly difficulties = ['Básico', 'Intermedio', 'Avanzado'] as const;

  private readonly filters = toSignal(
    this.route.queryParamMap.pipe(
      map((params): ActivityFilters => ({
        q: params.get('q') ?? '',
        area: params.get('area') ?? '',
        grade: params.get('grade') ?? '',
        difficulty: params.get('difficulty') ?? '',
      })),
    ),
    { initialValue: EMPTY_ACTIVITY_FILTERS },
  );

  protected readonly current = computed(() => this.filters());

  protected readonly activityList = computed(() => this.catalog.filterActivities(this.filters()));

  constructor() {
    const initial = this.route.snapshot.queryParamMap.get('q') ?? '';
    this.queryDraft.set(initial);
  }

  protected setFilter(key: keyof ActivityFilters, value: string): void {
    if (key === 'q') {
      this.queryDraft.set(value);
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: value || null },
      queryParamsHandling: 'merge',
    });
  }

  protected clearFilters(): void {
    this.queryDraft.set('');
    void this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  protected openDetail(activity: LibraryResource): void {
    this.selectedActivity = activity;
  }
}
