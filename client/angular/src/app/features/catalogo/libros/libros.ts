import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { CatalogService, EMPTY_FILTERS, type CatalogFilters } from '../../../core/catalog.service';
import { CURRICULAR_AREAS, DOCUMENT_FORMATS, DOCUMENT_TYPES, GRADES, gradeLabel } from '../../../core/curriculum';
import { ResourceCard } from '../resource-card/resource-card';
import { ResourceDetail } from '../resource-detail/resource-detail';
import type { LibraryResource } from '../../../core/resources';

const PAGE_SIZE = 8;

@Component({
  selector: 'app-libros',
  imports: [ResourceCard, ResourceDetail],
  templateUrl: './libros.html',
  styleUrl: './libros.scss',
})
export class Libros {
  private readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly areas = CURRICULAR_AREAS;
  protected readonly grades = GRADES;
  protected readonly types = DOCUMENT_TYPES;
  protected readonly formats = DOCUMENT_FORMATS;
  protected readonly gradeLabel = gradeLabel;
  protected readonly queryDraft = signal('');
  protected readonly page = signal(1);
  protected selected: LibraryResource | null = null;

  private readonly filters = toSignal(
    this.route.queryParamMap.pipe(
      map((params): CatalogFilters => ({
        q: params.get('q') ?? '',
        area: params.get('area') ?? '',
        grade: params.get('grade') ?? '',
        type: params.get('type') ?? '',
        format: params.get('format') ?? '',
      })),
    ),
    { initialValue: EMPTY_FILTERS },
  );

  protected readonly current = computed(() => this.filters());

  protected readonly shown = computed(() => this.catalog.filterDocuments(this.filters()));

  protected readonly pages = computed(() => Math.max(1, Math.ceil(this.shown().length / PAGE_SIZE)));

  protected readonly currentPage = computed(() => Math.min(this.page(), this.pages()));

  protected readonly pageItems = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.shown().slice(start, start + PAGE_SIZE);
  });

  constructor() {
    const initial = this.route.snapshot.queryParamMap.get('q') ?? '';
    this.queryDraft.set(initial);
  }

  protected setFilter(key: keyof CatalogFilters, value: string): void {
    this.page.set(1);
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
    this.page.set(1);
    void this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  protected previousPage(): void {
    this.page.update((value) => Math.max(1, value - 1));
  }

  protected nextPage(): void {
    this.page.update((value) => Math.min(this.pages(), value + 1));
  }
}
