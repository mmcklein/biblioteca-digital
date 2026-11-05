import { Injectable } from '@angular/core';
import {
  DEMO_RESOURCES,
  isActivity,
  isDocument,
  isVideo,
  type DifficultyLevel,
  type LibraryResource,
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

@Injectable({ providedIn: 'root' })
export class CatalogService {
  readonly resources = DEMO_RESOURCES;

  documents(): LibraryResource[] {
    return this.resources.filter(isDocument);
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
    return this.resources.filter(isVideo);
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
    return this.resources.filter(isActivity);
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
    return this.resources.find((resource) => resource.id === id);
  }
}
