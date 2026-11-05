import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { areaById, gradeLabel } from '../../../core/curriculum';
import type { LibraryResource } from '../../../core/resources';

@Component({
  selector: 'app-activity-detail',
  imports: [FormsModule],
  templateUrl: './activity-detail.html',
  styleUrl: './activity-detail.scss',
})
export class ActivityDetail {
  readonly resource = input.required<LibraryResource>();
  readonly closed = output<void>();

  protected readonly completed = signal(false);
  protected readonly downloaded = signal(false);
  protected readonly completedSteps = signal<Set<number>>(new Set());
  protected studentNote = '';

  protected readonly area = computed(() => areaById(this.resource().areaId));
  protected readonly grade = computed(() => gradeLabel(this.resource().grade));

  protected toggleStep(index: number): void {
    const current = new Set(this.completedSteps());
    if (current.has(index)) {
      current.delete(index);
    } else {
      current.add(index);
    }
    this.completedSteps.set(current);
  }

  protected isStepDone(index: number): boolean {
    return this.completedSteps().has(index);
  }

  protected toggleCompleted(): void {
    this.completed.update((val) => !val);
  }

  protected markDownloaded(): void {
    this.downloaded.set(true);
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}

