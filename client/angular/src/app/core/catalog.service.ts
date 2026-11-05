import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import {
  CURRICULAR_AREAS,
  INITIAL_CURRICULAR_AREAS,
  type CurricularArea,
} from './curriculum';
import {
  DEMO_RESOURCES,
  isActivity,
  isDocument,
  isVideo,
  type DifficultyLevel,
  type LibraryResource,
  type ResourceStatus,
} from './resources';

export interface CatalogFilters {
  q: string;
  area: string;
  grade: string;
  type: string;
  format: string;
}

export interface VideoFilters {
  q: string;
  area: string;
  grade: string;
}

export interface ActivityFilters {
  q: string;
  area: string;
  grade: string;
  difficulty: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export const EMPTY_FILTERS: CatalogFilters = {
  q: '',
  area: '',
  grade: '',
  type: '',
  format: '',
};

export const EMPTY_VIDEO_FILTERS: VideoFilters = {
  q: '',
  area: '',
  grade: '',
};

export const EMPTY_ACTIVITY_FILTERS: ActivityFilters = {
  q: '',
  area: '',
  grade: '',
  difficulty: '',
};

const RESOURCES_KEY = 'bastidas_catalog_resources';
const AREAS_KEY = 'bastidas_curricular_areas';
const AUDIT_KEY = 'bastidas_audit_logs';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly resourcesState = signal<LibraryResource[]>(this.loadResources());
  private readonly areasState = signal<CurricularArea[]>(this.loadAreas());
  private readonly auditLogsState = signal<AuditLog[]>(this.loadAuditLogs());

  readonly resources = computed(() => this.resourcesState());
  readonly areas = computed(() => this.areasState());
  readonly auditLogs = computed(() => this.auditLogsState());

  // --- Métodos de Consulta Pública (solo recursos publicados) ---

  documents(): LibraryResource[] {
    return this.resourcesState().filter((r) => isDocument(r) && r.status === 'publicado');
  }

  featuredDocuments(): LibraryResource[] {
    return this.documents().filter((resource) => resource.featured);
  }

  countByArea(areaId: number): number {
    return this.documents().filter((resource) => resource.areaId === areaId).length;
  }

  countByGrade(grade: number): number {
    return this.documents().filter((resource) => resource.grade === grade).length;
  }

  filterDocuments(filters: CatalogFilters): LibraryResource[] {
    const query = filters.q.trim().toLowerCase();

    return this.documents().filter((resource) => {
      const haystack = [resource.title, resource.description, resource.author, resource.type, resource.format].join(
        ' ',
      ).toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesArea = !filters.area || String(resource.areaId) === filters.area;
      const matchesGrade = !filters.grade || String(resource.grade) === filters.grade;
      const matchesType = !filters.type || resource.type === filters.type;
      const matchesFormat = !filters.format || resource.format === filters.format;
      return matchesQuery && matchesArea && matchesGrade && matchesType && matchesFormat;
    });
  }

  videos(): LibraryResource[] {
    return this.resourcesState().filter((r) => isVideo(r) && r.status === 'publicado');
  }

  filterVideos(filters: VideoFilters): LibraryResource[] {
    const query = filters.q.trim().toLowerCase();

    return this.videos().filter((resource) => {
      const haystack = [
        resource.title,
        resource.description,
        resource.author,
        ...(resource.topics ?? []),
      ].join(' ').toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesArea = !filters.area || String(resource.areaId) === filters.area;
      const matchesGrade = !filters.grade || String(resource.grade) === filters.grade;
      return matchesQuery && matchesArea && matchesGrade;
    });
  }

  activities(): LibraryResource[] {
    return this.resourcesState().filter((r) => isActivity(r) && r.status === 'publicado');
  }

  filterActivities(filters: ActivityFilters): LibraryResource[] {
    const query = filters.q.trim().toLowerCase();

    return this.activities().filter((resource) => {
      const haystack = [
        resource.title,
        resource.description,
        resource.author,
        resource.difficulty ?? '',
        ...(resource.steps ?? []),
      ].join(' ').toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesArea = !filters.area || String(resource.areaId) === filters.area;
      const matchesGrade = !filters.grade || String(resource.grade) === filters.grade;
      const matchesDifficulty = !filters.difficulty || resource.difficulty === (filters.difficulty as DifficultyLevel);
      return matchesQuery && matchesArea && matchesGrade && matchesDifficulty;
    });
  }

  byId(id: number): LibraryResource | undefined {
    return this.resourcesState().find((resource) => resource.id === id);
  }

  // --- Operaciones de Administración (Control Total por Administrador) ---

  allResourcesList(): LibraryResource[] {
    return this.resourcesState();
  }

  createResource(data: Omit<LibraryResource, 'id'>, performedBy = 'Administrador'): LibraryResource {
    const nextId = this.resourcesState().reduce((max, r) => Math.max(max, r.id), 0) + 1;
    const now = new Date().toISOString().split('T')[0];

    const newResource: LibraryResource = {
      ...data,
      id: nextId,
      status: data.status ?? 'publicado',
      createdAt: data.createdAt ?? now,
      createdBy: data.createdBy ?? performedBy,
    };

    const updated = [newResource, ...this.resourcesState()];
    this.saveResources(updated);
    this.recordAudit('Creación de material', performedBy, `Registrado "${newResource.title}" (${newResource.type})`);
    return newResource;
  }

  updateResource(id: number, changes: Partial<Omit<LibraryResource, 'id'>>, performedBy = 'Administrador'): void {
    const updated = this.resourcesState().map((item) => {
      if (item.id === id) {
        return { ...item, ...changes };
      }
      return item;
    });
    this.saveResources(updated);
    this.recordAudit('Modificación de material', performedBy, `Actualizado ID ${id}`);
  }

  setResourceStatus(id: number, status: ResourceStatus, performedBy = 'Administrador'): void {
    const target = this.byId(id);
    this.updateResource(id, { status }, performedBy);
    this.recordAudit(
      status === 'publicado' ? 'Publicación de material' : 'Retiro de material',
      performedBy,
      `${status === 'publicado' ? 'Publicado' : 'Retirado'} "${target?.title ?? id}"`,
    );
  }

  deleteResource(id: number, performedBy = 'Administrador'): void {
    const target = this.byId(id);
    const updated = this.resourcesState().filter((r) => r.id !== id);
    this.saveResources(updated);
    this.recordAudit('Eliminación de material', performedBy, `Eliminado "${target?.title ?? id}"`);
  }

  // Administración de Áreas Curriculares
  updateArea(id: number, changes: Partial<CurricularArea>, performedBy = 'Administrador'): void {
    const updated = this.areasState().map((area) => {
      if (area.id === id) {
        return { ...area, ...changes };
      }
      return area;
    });
    this.saveAreas(updated);
    this.recordAudit('Modificación de área curricular', performedBy, `Área ID ${id} modificada`);
  }

  // Registro de Auditoría / Operaciones
  recordAudit(action: string, user: string, details: string): void {
    const nextId = this.auditLogsState().reduce((max, log) => Math.max(max, log.id), 0) + 1;
    const now = new Date();
    const timeStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newLog: AuditLog = {
      id: nextId,
      timestamp: timeStr,
      action,
      user,
      details,
    };

    const updated = [newLog, ...this.auditLogsState()].slice(0, 50); // Guarda los últimos 50 registros
    this.auditLogsState.set(updated);
    if (this.isBrowser) {
      try {
        localStorage.setItem(AUDIT_KEY, JSON.stringify(updated));
      } catch {
        // Ignorar
      }
    }
  }

  // Exportar respaldo JSON local para el Administrador
  exportBackupJson(): string {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      institution: 'I.E. Micaela Bastidas Puyucahua',
      resources: this.resourcesState(),
      areas: this.areasState(),
      auditLogs: this.auditLogsState(),
    };
    this.recordAudit('Copia de respaldo', 'Administrador', 'Generado archivo de respaldo offline');
    return JSON.stringify(data, null, 2);
  }

  private saveResources(list: LibraryResource[]): void {
    this.resourcesState.set(list);
    if (this.isBrowser) {
      try {
        localStorage.setItem(RESOURCES_KEY, JSON.stringify(list));
      } catch {
        // Ignorar
      }
    }
  }

  private saveAreas(list: CurricularArea[]): void {
    this.areasState.set(list);
    if (this.isBrowser) {
      try {
        localStorage.setItem(AREAS_KEY, JSON.stringify(list));
      } catch {
        // Ignorar
      }
    }
  }

  private loadResources(): LibraryResource[] {
    if (this.isBrowser) {
      try {
        const raw = localStorage.getItem(RESOURCES_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Ignorar
      }
    }
    return DEMO_RESOURCES;
  }

  private loadAreas(): CurricularArea[] {
    if (this.isBrowser) {
      try {
        const raw = localStorage.getItem(AREAS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Ignorar
      }
    }
    return INITIAL_CURRICULAR_AREAS;
  }

  private loadAuditLogs(): AuditLog[] {
    if (this.isBrowser) {
      try {
        const raw = localStorage.getItem(AUDIT_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch {
        // Ignorar
      }
    }
    return [
      {
        id: 1,
        timestamp: '2026-03-01 08:30',
        action: 'Inicio de sistema',
        user: 'Administrador',
        details: 'Configuración inicial de la biblioteca digital offline',
      },
      {
        id: 2,
        timestamp: '2026-03-01 09:00',
        action: 'Carga de catálogo base',
        user: 'Administrador',
        details: 'Se integraron 28 materiales curriculares de secundaria',
      },
    ];
  }
}
