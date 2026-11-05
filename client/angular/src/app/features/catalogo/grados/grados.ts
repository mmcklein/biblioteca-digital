import { Component, computed, inject, signal } from '@angular/core';
import { CatalogService } from '../../../core/catalog.service';
import { CURRICULAR_AREAS, GRADES, gradeLabel } from '../../../core/curriculum';
import { ResourceCard } from '../resource-card/resource-card';
import { ResourceDetail } from '../resource-detail/resource-detail';
import type { LibraryResource } from '../../../core/resources';

@Component({
  selector: 'app-grados',
  imports: [ResourceCard, ResourceDetail],
  templateUrl: './grados.html',
  styleUrl: './grados.scss',
})
export class Grados {
  private readonly catalog = inject(CatalogService);

  protected readonly grades = GRADES;
  protected readonly areas = CURRICULAR_AREAS;
  protected readonly selectedGrade = signal<(typeof GRADES)[number]>(3);
  protected readonly selectedArea = signal(-1);
  protected selected: LibraryResource | null = null;
  protected readonly gradeLabel = gradeLabel;

  protected readonly shown = computed(() => {
    const grade = this.selectedGrade();
    const area = this.selectedArea();
    return this.catalog.documents().filter((resource) => {
      return resource.grade === grade && (area === -1 || resource.areaId === area);
    });
  });

  protected onAreaChange(value: string): void {
    this.selectedArea.set(Number(value));
  }
}
