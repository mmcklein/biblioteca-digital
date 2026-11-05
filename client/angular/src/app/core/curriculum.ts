export interface CurricularArea {
  id: number;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export const INITIAL_CURRICULAR_AREAS: CurricularArea[] = [
  { id: 0, name: 'Matemática', icon: '📐', color: '#ddba7c', description: 'Razonamiento lógico, números y resolución de problemas' },
  { id: 1, name: 'Comunicación', icon: '📖', color: '#d8c5ab', description: 'Lectura comprensiva, expresión oral y redacción' },
  { id: 2, name: 'Ciencia y Tecnología', icon: '🔬', color: '#a8cdb3', description: 'Indagación científica, biología y física aplicada' },
  { id: 3, name: 'Ciencias Sociales', icon: '🌎', color: '#c0bfd8', description: 'Historia del Perú, geografía y economía' },
  { id: 4, name: 'Inglés', icon: '🔤', color: '#b8d6e9', description: 'Comunicación en lengua extranjera' },
  { id: 5, name: 'Arte y Cultura', icon: '🎨', color: '#e5b5ab', description: 'Apreciación artística, música y artes visuales' },
  { id: 6, name: 'Educación Física', icon: '⚽', color: '#b4d2bc', description: 'Desarrollo corporal y vida saludable' },
  { id: 7, name: 'Educación para el Trabajo', icon: '💻', color: '#ddd2a3', description: 'Emprendimiento, computación y proyectos productivos' },
  { id: 8, name: 'Tutoría y Convivencia', icon: '🤝', color: '#c8d4e3', description: 'Acompañamiento socioafectivo y valores' },
  { id: 9, name: 'Educación Religiosa', icon: '🕊️', color: '#e3cfb0', description: 'Dimensión trascendente y ética' },
  { id: 10, name: 'Educación para la Ciudadanía Global', icon: '🌐', color: '#c5b8d9', description: 'Derechos humanos y participación ciudadana' },
];

export const CURRICULAR_AREAS = INITIAL_CURRICULAR_AREAS;

export const GRADES = [1, 2, 3, 4, 5] as const;

export const DOCUMENT_TYPES = ['Libro', 'Guía', 'Ficha', 'Investigación', 'Presentación'] as const;
export const DOCUMENT_FORMATS = ['PDF', 'DOCX', 'PPT', 'ePub'] as const;

export type Grade = (typeof GRADES)[number];
export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export type DocumentFormat = (typeof DOCUMENT_FORMATS)[number];

export function areaById(id: number, customAreas?: CurricularArea[]): CurricularArea | undefined {
  const source = customAreas ?? CURRICULAR_AREAS;
  return source.find((area) => area.id === id);
}

export function gradeLabel(grade: number): string {
  return `${grade}.º de secundaria`;
}
