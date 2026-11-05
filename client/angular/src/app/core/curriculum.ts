export const CURRICULAR_AREAS = [
  { id: 0, name: 'Matemática', icon: '📐', color: '#ddba7c' },
  { id: 1, name: 'Comunicación', icon: '📖', color: '#d8c5ab' },
  { id: 2, name: 'Ciencia y Tecnología', icon: '🔬', color: '#a8cdb3' },
  { id: 3, name: 'Ciencias Sociales', icon: '🌎', color: '#c0bfd8' },
  { id: 4, name: 'Inglés', icon: '🔤', color: '#b8d6e9' },
  { id: 5, name: 'Arte y Cultura', icon: '🎨', color: '#e5b5ab' },
  { id: 6, name: 'Educación Física', icon: '⚽', color: '#b4d2bc' },
  { id: 7, name: 'Educación para el Trabajo', icon: '💻', color: '#ddd2a3' },
  { id: 8, name: 'Tutoría y Convivencia', icon: '🤝', color: '#c8d4e3' },
  { id: 9, name: 'Educación Religiosa', icon: '🕊️', color: '#e3cfb0' },
  { id: 10, name: 'Educación para la Ciudadanía Global', icon: '🌐', color: '#c5b8d9' },
] as const;

export const GRADES = [1, 2, 3, 4, 5] as const;

export const DOCUMENT_TYPES = ['Libro', 'Guía', 'Ficha', 'Investigación', 'Presentación'] as const;
export const DOCUMENT_FORMATS = ['PDF', 'DOCX', 'PPT', 'ePub'] as const;

export type CurricularArea = (typeof CURRICULAR_AREAS)[number];
export type Grade = (typeof GRADES)[number];
export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export type DocumentFormat = (typeof DOCUMENT_FORMATS)[number];

export function areaById(id: number): CurricularArea | undefined {
  return CURRICULAR_AREAS.find((area) => area.id === id);
}

export function gradeLabel(grade: number): string {
  return `${grade}.º de secundaria`;
}
