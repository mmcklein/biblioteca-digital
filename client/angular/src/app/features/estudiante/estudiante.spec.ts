import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AuthService } from '../../core/auth/auth.service';
import { CatalogService } from '../../core/catalog.service';
import { Estudiante } from './estudiante';

describe('Estudiante Component', () => {
  it('se crea correctamente e inicia con la pestaña catalogo', () => {
    TestBed.configureTestingModule({
      imports: [Estudiante],
      providers: [AuthService, CatalogService],
    });

    const auth = TestBed.inject(AuthService);
    auth.loginWithUsername('estudiante.juan');

    const fixture = TestBed.createComponent(Estudiante);
    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.componentInstance as any).activeTab()).toBe('catalogo');
  });

  it('filtra catálogo para su grado y lista actividades asignadas', () => {
    TestBed.configureTestingModule({
      imports: [Estudiante],
      providers: [AuthService, CatalogService],
    });

    const auth = TestBed.inject(AuthService);
    auth.loginWithUsername('estudiante.juan'); // Juan tiene grade = 3

    const fixture = TestBed.createComponent(Estudiante);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    // Ninguna actividad debe estar en gradeCatalog
    const catalogItems = (component as any).gradeCatalog();
    expect(catalogItems.every((item: any) => item.type !== 'Actividad')).toBe(true);

    // Todas las de assignedActivities deben ser de tipo Actividad
    const activities = (component as any).assignedActivities();
    expect(activities.every((item: any) => item.type === 'Actividad')).toBe(true);
  });
});

