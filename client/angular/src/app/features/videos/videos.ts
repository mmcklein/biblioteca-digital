import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { CatalogService, EMPTY_VIDEO_FILTERS, type VideoFilters } from '../../core/catalog.service';
import { CURRICULAR_AREAS, GRADES, areaById, gradeLabel } from '../../core/curriculum';
import type { LibraryResource } from '../../core/resources';
import { VideoPlayer } from './video-player/video-player';

@Component({
  selector: 'app-videos',
  imports: [VideoPlayer],
  templateUrl: './videos.html',
  styleUrl: './videos.scss',
})
export class Videos {
  private readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly areas = CURRICULAR_AREAS;
  protected readonly grades = GRADES;
  protected readonly gradeLabel = gradeLabel;
  protected readonly areaById = areaById;
  protected readonly queryDraft = signal('');
  protected selectedVideo: LibraryResource | null = null;

  private readonly filters = toSignal(
    this.route.queryParamMap.pipe(
      map((params): VideoFilters => ({
        q: params.get('q') ?? '',
        area: params.get('area') ?? '',
        grade: params.get('grade') ?? '',
      })),
    ),
    { initialValue: EMPTY_VIDEO_FILTERS },
  );

  protected readonly current = computed(() => this.filters());

  protected readonly videoList = computed(() => this.catalog.filterVideos(this.filters()));

  constructor() {
    const initial = this.route.snapshot.queryParamMap.get('q') ?? '';
    this.queryDraft.set(initial);
  }

  protected setFilter(key: keyof VideoFilters, value: string): void {
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

  protected openPlayer(video: LibraryResource): void {
    this.selectedVideo = video;
  }
}
