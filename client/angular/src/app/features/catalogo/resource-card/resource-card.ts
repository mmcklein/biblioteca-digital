import { Component, input, output } from '@angular/core';
import { areaById, gradeLabel } from '../../../core/curriculum';
import type { LibraryResource } from '../../../core/resources';

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.html',
  styleUrl: './resource-card.scss',
})
export class ResourceCard {
  readonly resource = input.required<LibraryResource>();
  readonly openDetail = output<LibraryResource>();

  protected area() {
    return areaById(this.resource().areaId);
  }

  protected grade() {
    return gradeLabel(this.resource().grade);
  }
}
