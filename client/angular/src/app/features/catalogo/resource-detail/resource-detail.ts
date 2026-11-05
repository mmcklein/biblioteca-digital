import { Component, input, output } from '@angular/core';
import { areaById, gradeLabel } from '../../../core/curriculum';
import type { LibraryResource } from '../../../core/resources';

@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.html',
  styleUrl: './resource-detail.scss',
})
export class ResourceDetail {
  readonly resource = input.required<LibraryResource>();
  readonly closed = output<void>();

  protected area() {
    return areaById(this.resource().areaId);
  }

  protected grade() {
    return gradeLabel(this.resource().grade);
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
