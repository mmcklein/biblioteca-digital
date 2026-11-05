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

  it('should filter videos by grade and query', () => {
    const results = service.filterVideos({ q: 'agua', area: '', grade: '' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.title.includes('agua') || r.description.includes('agua'))).toBe(true);
  });

  it('should filter activities by difficulty', () => {
    const basicas = service.filterActivities({ q: '', area: '', grade: '', difficulty: 'Básico' });
    expect(basicas.length).toBeGreaterThan(0);
    expect(basicas.every((a) => a.difficulty === 'Básico')).toBe(true);
  });
});

