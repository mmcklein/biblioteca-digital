import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../core/catalog.service';
import { CURRICULAR_AREAS } from '../../../core/curriculum';
import { ResourceCard } from '../resource-card/resource-card';
import { ResourceDetail } from '../resource-detail/resource-detail';
import type { LibraryResource } from '../../../core/resources';

@Component({
  selector: 'app-areas',
  imports: [RouterLink, ResourceCard, ResourceDetail],
  templateUrl: './areas.html',
  styleUrl: './areas.scss',
})
export class Areas {
  private readonly catalog = inject(CatalogService);

  protected readonly areas = CURRICULAR_AREAS;
  protected readonly featured = this.catalog.featuredDocuments().slice(0, 5);
  protected selected: LibraryResource | null = null;

  protected count(areaId: number): number {
    return this.catalog.countByArea(areaId);
  }
}
