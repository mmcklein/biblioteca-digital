import { TestBed } from '@angular/core/testing';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  let service: CatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should separate documents, videos and activities', () => {
    const docs = service.documents();
    const videos = service.videos();
    const activities = service.activities();

    expect(docs.length).toBeGreaterThan(0);
    expect(videos.length).toBeGreaterThan(0);
    expect(activities.length).toBeGreaterThan(0);

    expect(videos.every((v) => v.type === 'Video')).toBe(true);
    expect(activities.every((a) => a.type === 'Actividad')).toBe(true);
    expect(docs.every((d) => d.type !== 'Video' && d.type !== 'Actividad')).toBe(true);
  });

  it('should filter videos by query', () => {
    const results = service.filterVideos({ q: 'agua', area: '', grade: '' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.title.includes('agua') || r.description.includes('agua'))).toBe(true);
  });

  it('should allow admin to create, update, set status and delete resources', () => {
    const initialCount = service.allResourcesList().length;

    // Crear recurso
    const created = service.createResource({
      title: 'Geometría del Espacio',
      areaId: 0,
      grade: 4,
      format: 'PDF',
      type: 'Libro',
      description: 'Poliedros y cuerpos redondos.',
      author: 'Prof. Carlos Hurtado',
      featured: false,
      status: 'publicado',
    });

    expect(created.id).toBeGreaterThan(0);
    expect(service.allResourcesList().length).toBe(initialCount + 1);

    // Retirar del catálogo público
    service.setResourceStatus(created.id, 'retirado');
    expect(service.byId(created.id)?.status).toBe('retirado');
    expect(service.documents().some((d) => d.id === created.id)).toBe(false);

    // Volver a publicar
    service.setResourceStatus(created.id, 'publicado');
    expect(service.documents().some((d) => d.id === created.id)).toBe(true);

    // Eliminar
    service.deleteResource(created.id);
    expect(service.byId(created.id)).toBeUndefined();
    expect(service.allResourcesList().length).toBe(initialCount);
  });

  it('should allow teacher to manage own materials and forbid modifying others', () => {
    const carlos = { username: 'prof.carlos', name: 'Prof. Carlos Hurtado Valer' };
    const maria = { username: 'prof.maria', name: 'Prof. María Quispe Rojas' };

    // 1. Docente crea material
    const mat = service.createTeacherResource(
      {
        title: 'Álgebra Intermedia',
        areaId: 0,
        grade: 3,
        format: 'PDF',
        type: 'Guía',
        description: 'Factorización de polinomios.',
        author: carlos.name,
        featured: false,
        status: 'publicado',
      },
      carlos,
    );

    expect(mat.creatorUsername).toBe(carlos.username);

    // 2. Docente edita su propio material
    service.updateTeacherResource(mat.id, { description: 'Nueva descripción' }, carlos);
    expect(service.byId(mat.id)?.description).toBe('Nueva descripción');

    // 3. Otro docente intenta editar -> debe lanzar excepción
    expect(() => {
      service.updateTeacherResource(mat.id, { description: 'Intento no autorizado' }, maria);
    }).toThrowError(/Permiso denegado/);

    // 4. Otro docente intenta eliminar -> debe lanzar excepción
    expect(() => {
      service.deleteTeacherResource(mat.id, maria);
    }).toThrowError(/Permiso denegado/);

    // 5. El propio docente puede asignar actividad o eliminar
    service.assignTeacherActivity(mat.id, [2, 3], carlos);
    expect(service.byId(mat.id)?.assignedGrades).toEqual([2, 3]);

    service.deleteTeacherResource(mat.id, carlos);
    expect(service.byId(mat.id)).toBeUndefined();
  });

  it('should record audit logs when actions are performed', () => {
    const initialLogsCount = service.auditLogs().length;
    service.recordAudit('Prueba de auditoría', 'Administrador', 'Detalle de prueba');

    expect(service.auditLogs().length).toBe(initialLogsCount + 1);
    expect(service.auditLogs()[0].action).toBe('Prueba de auditoría');
  });
});
