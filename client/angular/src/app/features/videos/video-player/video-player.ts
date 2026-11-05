import { Component, computed, input, output, signal } from '@angular/core';
import { areaById, gradeLabel } from '../../../core/curriculum';
import type { LibraryResource } from '../../../core/resources';

@Component({
  selector: 'app-video-player',
  imports: [],
  templateUrl: './video-player.html',
  styleUrl: './video-player.scss',
})
export class VideoPlayer {
  readonly resource = input.required<LibraryResource>();
  readonly closed = output<void>();

  protected readonly isPlaying = signal(false);
  protected readonly isWatched = signal(false);
  protected readonly downloadOffline = signal(false);

  protected readonly area = computed(() => areaById(this.resource().areaId));
  protected readonly grade = computed(() => gradeLabel(this.resource().grade));

  protected togglePlay(): void {
    this.isPlaying.update((val) => !val);
  }

  protected toggleWatched(): void {
    this.isWatched.update((val) => !val);
  }

  protected markDownloaded(): void {
    this.downloadOffline.set(true);
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}

