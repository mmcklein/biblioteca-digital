import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CatalogService } from '../../../core/catalog.service';
import { INSTITUTION } from '../../../core/institution';
import type { LibraryResource } from '../../../core/resources';
import { ResourceCard } from '../../catalogo/resource-card/resource-card';
import { ResourceDetail } from '../../catalogo/resource-detail/resource-detail';

@Component({
  selector: 'app-inicio',
  imports: [FormsModule, RouterLink, ResourceCard, ResourceDetail],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogService);

  protected readonly institution = INSTITUTION;
  protected query = '';
  protected readonly featured = this.catalog.featuredDocuments().slice(0, 4);
  protected selected: LibraryResource | null = null;

  protected search(): void {
    const q = this.query.trim();
    void this.router.navigate(['/libros'], { queryParams: q ? { q } : {} });
  }
}
