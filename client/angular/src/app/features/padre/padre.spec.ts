import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AuthService } from '../../core/auth/auth.service';
import { CatalogService } from '../../core/catalog.service';
import { Padre } from './padre';

describe('Padre Component', () => {
  it('se crea correctamente', () => {
    TestBed.configureTestingModule({
      imports: [Padre],
      providers: [AuthService, CatalogService],
    });

    const auth = TestBed.inject(AuthService);
    auth.loginWithUsername('padre.rosa');

    const fixture = TestBed.createComponent(Padre);
    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.componentInstance as any).activeTab()).toBe('catalogo');
  });

  it('el catálogo familiar excluye estrictamente las actividades de resolución', () => {
    TestBed.configureTestingModule({
      imports: [Padre],
      providers: [AuthService, CatalogService],
    });

    const auth = TestBed.inject(AuthService);
    auth.loginWithUsername('padre.rosa');

    const fixture = TestBed.createComponent(Padre);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const catalog = (component as any).familyCatalog();
    expect(catalog.every((item: any) => item.type !== 'Actividad')).toBe(true);
  });
});

