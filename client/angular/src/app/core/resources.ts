export type ResourceKind = 'Libro' | 'Guía' | 'Ficha' | 'Investigación' | 'Presentación' | 'Actividad' | 'Video';
export type ResourceFormat = 'PDF' | 'DOCX' | 'PPT' | 'MP4' | 'ePub';
export type DifficultyLevel = 'Básico' | 'Intermedio' | 'Avanzado';
export type ResourceStatus = 'publicado' | 'retirado' | 'borrador';

export interface LibraryResource {
  id: number;
  title: string;
  areaId: number;
  grade: 1 | 2 | 3 | 4 | 5;
  format: ResourceFormat;
  type: ResourceKind;
  description: string;
  author: string;
  featured: boolean;
  status: ResourceStatus;
  createdBy?: string;
  creatorUsername?: string;
  createdAt?: string;
  duration?: string;
  difficulty?: DifficultyLevel;
  topics?: string[];
  steps?: string[];
  assignedGrades?: number[];
  fileName?: string;
}

interface RawSeed {
  title: string;
  areaId: number;
  grade: 1 | 2 | 3 | 4 | 5;
  format: ResourceFormat;
  type: ResourceKind;
  description: string;
  duration?: string;
  difficulty?: DifficultyLevel;
  topics?: string[];
  steps?: string[];
}

const SEEDS: RawSeed[] = [
  // Documentos y libros
  {
    title: 'Ecuaciones de primer grado',
    areaId: 0,
    grade: 1,
    format: 'PDF',
    type: 'Libro',
    description: 'Aprende a resolver ecuaciones paso a paso con problemas de la vida cotidiana.',
  },
  {
    title: 'El texto narrativo',
    areaId: 1,
    grade: 2,
    format: 'PDF',
    type: 'Guía',
    description: 'Estructura, tipos de narrador, personajes y estrategias de comprensión lectora.',
  },
  {
    title: 'La célula y sus funciones',
    areaId: 2,
    grade: 3,
    format: 'PDF',
    type: 'Libro',
    description: 'La unidad básica de la vida, organelos celulares y diferencias entre célula animal y vegetal.',
  },
  {
    title: 'Civilizaciones de la Antigüedad',
    areaId: 3,
    grade: 2,
    format: 'PDF',
    type: 'Libro',
    description: 'Historia, legado cultural y organización social de las grandes civilizaciones.',
  },
  {
    title: 'Present Simple',
    areaId: 4,
    grade: 3,
    format: 'PPT',
    type: 'Presentación',
    description: 'Introducción al tiempo presente simple en inglés con reglas gramaticales y ejemplos.',
  },
  {
    title: 'Técnicas de pintura',
    areaId: 5,
    grade: 2,
    format: 'PDF',
    type: 'Ficha',
    description: 'Teoría del color, círculo cromático, composición plástica y creatividad.',
  },
  {
    title: 'Hábitos para una vida saludable',
    areaId: 6,
    grade: 1,
    format: 'PDF',
    type: 'Ficha',
    description: 'Nutrición balanceada, hidratación y rutinas de calentamiento físico.',
  },
  {
    title: 'Emprendimiento e idea de negocio',
    areaId: 7,
    grade: 4,
    format: 'DOCX',
    type: 'Guía',
    description: 'Pasos para estructurar un modelo de negocio local, lienzo Lean Canvas y presupuesto.',
  },
  {
    title: 'Valores y comunidad',
    areaId: 9,
    grade: 1,
    format: 'PDF',
    type: 'Libro',
    description: 'Reflexión sobre la solidaridad, el respeto y la convivencia comunitaria.',
  },
  {
    title: 'Ciudadanía y derechos humanos',
    areaId: 10,
    grade: 5,
    format: 'PDF',
    type: 'Guía',
    description: 'Participación ciudadana responsable, democracia y defensa de los derechos fundamentales.',
  },
  {
    title: 'Matemática para todos',
    areaId: 0,
    grade: 4,
    format: 'PDF',
    type: 'Libro',
    description: 'Razonamiento lógico-matemático, trigonometría básica y funciones aplicadas.',
  },
  {
    title: 'Investigación: Independencia del Perú',
    areaId: 3,
    grade: 4,
    format: 'PDF',
    type: 'Investigación',
    description: 'Un recorrido analítico por el proceso independentista y los próceres de la patria.',
  },
  {
    title: 'English for Teens',
    areaId: 4,
    grade: 2,
    format: 'PDF',
    type: 'Libro',
    description: 'Vocabulario esencial, diálogos situacionales y expresiones comunes en inglés.',
  },
  {
    title: 'Manual de primeros auxilios',
    areaId: 2,
    grade: 5,
    format: 'PDF',
    type: 'Guía',
    description: 'Protocolos de atención inicial en la escuela ante caídas, heridas y emergencias.',
  },

  // Videos educativos
  {
    title: 'El ciclo del agua',
    areaId: 2,
    grade: 3,
    format: 'MP4',
    type: 'Video',
    description: 'Explicación dinámica de la evaporación, condensación, precipitación e infiltración.',
    duration: '11:45',
    topics: ['Evaporación', 'Condensación', 'Cuencas hidrográficas'],
  },
  {
    title: 'Historia del Perú: El Tahuantinsuyo',
    areaId: 3,
    grade: 2,
    format: 'MP4',
    type: 'Video',
    description: 'Organización política, social y cosmovisión andina en el imperio incaico.',
    duration: '15:20',
    topics: ['Incas', 'Chasquis', 'Ayllu', 'Cusco y Tamburco'],
  },
  {
    title: 'Matemática fácil: Fracciones y decimales',
    areaId: 0,
    grade: 1,
    format: 'MP4',
    type: 'Video',
    description: 'Aprende a sumar y restar fracciones heterogéneas con gráficos interactivos.',
    duration: '08:35',
    topics: ['Fracciones equivalentes', 'MCM', 'Conversión a decimal'],
  },
  {
    title: 'Verbos en Present Simple',
    areaId: 4,
    grade: 3,
    format: 'MP4',
    type: 'Video',
    description: 'Pronunciación y uso de verbos regulares e irregulares en oraciones afirmativas y negativas.',
    duration: '09:50',
    topics: ['Grammar rules', 'Third person -s/-es', 'Daily routines'],
  },
  {
    title: 'Técnicas de pintura: Acuarela y paisaje andino',
    areaId: 5,
    grade: 4,
    format: 'MP4',
    type: 'Video',
    description: 'Paso a paso para pintar paisajes con técnica de aguadas, luces y sombras.',
    duration: '14:10',
    topics: ['Paleta de colores', 'Papel de acuarela', 'Difuminados'],
  },
  {
    title: 'Experimentos científicos caseros',
    areaId: 2,
    grade: 4,
    format: 'MP4',
    type: 'Video',
    description: 'Demostración de reacciones químicas seguras para comprobar la ley de conservación.',
    duration: '12:05',
    topics: ['Método científico', 'Reacciones químicas', 'Seguridad'],
  },
  {
    title: 'Ecosistemas de la región Apurímac',
    areaId: 2,
    grade: 1,
    format: 'MP4',
    type: 'Video',
    description: 'Biodiversidad de la flora y fauna en los valles interandinos y punas de Apurímac.',
    duration: '13:30',
    topics: ['Fauna local', 'Pisos altitudinales', 'Conservación'],
  },
  {
    title: 'Programación básica con algoritmos',
    areaId: 7,
    grade: 5,
    format: 'MP4',
    type: 'Video',
    description: 'Introducción a variables, condicionales y ciclos con diagramas de flujo interactivos.',
    duration: '16:40',
    topics: ['Pseudocódigo', 'Condicionales Si/No', 'Bucles'],
  },

  // Actividades prácticas y fichas
  {
    title: 'Convivencia escolar y asertividad',
    areaId: 8,
    grade: 2,
    format: 'PDF',
    type: 'Actividad',
    description: 'Taller práctico con dinámicas de grupo para la resolución pacífica de conflictos en el aula.',
    difficulty: 'Básico',
    duration: '30 min',
    steps: [
      'Lectura de un caso de desacuerdo entre compañeros',
      'Identificación de emociones y posturas de cada parte',
      'Redacción de dos acuerdos consensuados en equipo',
    ],
  },
  {
    title: 'Fichas didácticas de comprensión lectora',
    areaId: 1,
    grade: 1,
    format: 'DOCX',
    type: 'Actividad',
    description: 'Textos cortos con preguntas de nivel literal, inferencial y crítico para practicar.',
    difficulty: 'Básico',
    duration: '40 min',
    steps: [
      'Lectura en voz alta del mito de origen andino',
      'Subrayado de palabras clave y conectores lógicos',
      'Desarrollo del cuestionario de 5 preguntas',
    ],
  },
  {
    title: 'Laboratorio de razones y proporciones',
    areaId: 0,
    grade: 2,
    format: 'PDF',
    type: 'Actividad',
    description: 'Problemas de proporcionalidad directa e inversa aplicados a recetas y distancias.',
    difficulty: 'Intermedio',
    duration: '45 min',
    steps: [
      'Completar tablas de valores proporcionales',
      'Graficar pares ordenados en el plano cartesiano',
      'Calcular la constante de proporcionalidad',
    ],
  },
  {
    title: 'Taller de argumentación y debate',
    areaId: 1,
    grade: 3,
    format: 'PDF',
    type: 'Actividad',
    description: 'Estructuración de tesis, argumentos de causa-efecto y preparación para mesas redondas.',
    difficulty: 'Intermedio',
    duration: '50 min',
    steps: [
      'Elección de un tema de interés escolar o ambiental',
      'Búsqueda de 2 evidencias que sustenten la postura',
      'Simulación de debate de 3 minutos por participante',
    ],
  },
  {
    title: 'Geometría y figuras del entorno',
    areaId: 0,
    grade: 1,
    format: 'PDF',
    type: 'Actividad',
    description: 'Identificación de polígonos regulares e irregulares en la arquitectura escolar.',
    difficulty: 'Básico',
    duration: '35 min',
    steps: [
      'Medir los lados de objetos rectangulares del aula',
      'Calcular perímetros y áreas con fórmulas básicas',
      'Diseñar un croquis a escala en papel milimetrado',
    ],
  },
  {
    title: 'Proyecto de reciclaje escolar',
    areaId: 2,
    grade: 1,
    format: 'PDF',
    type: 'Actividad',
    description: 'Guía de campo para clasificar residuos sólidos y elaborar compostaje orgánico.',
    difficulty: 'Básico',
    duration: '60 min',
    steps: [
      'Monitoreo semanal del tipo de residuos en el colegio',
      'Separación por contenedores de color normado',
      'Elaboración de cartel informativo para la comunidad',
    ],
  },
  {
    title: 'Línea de tiempo histórica del Perú',
    areaId: 3,
    grade: 1,
    format: 'PDF',
    type: 'Actividad',
    description: 'Construcción colaborativa de una línea de tiempo desde el periodo prehispánico.',
    difficulty: 'Intermedio',
    duration: '40 min',
    steps: [
      'Ordenar cronológicamente 8 sucesos clave',
      'Asignar imágenes o ilustraciones representativas',
      'Escribir una conclusión sobre el impacto en el presente',
    ],
  },
  {
    title: 'Reto de pensamiento crítico y ciudadanía',
    areaId: 10,
    grade: 5,
    format: 'PDF',
    type: 'Actividad',
    description: 'Análisis de dilemas éticos y formulación de propuestas de mejora comunitaria.',
    difficulty: 'Avanzado',
    duration: '50 min',
    steps: [
      'Lectura del dilema sobre uso responsable del agua',
      'Evaluación de ventajas y desventajas por grupo de interés',
      'Redacción de un acta de compromiso con propuestas reales',
    ],
  },
];

export const DEMO_RESOURCES: LibraryResource[] = SEEDS.map((seed, index) => {
  const isCarlos = seed.areaId === 0;
  const isMaria = seed.areaId === 1;

  const creatorUsername = isCarlos ? 'prof.carlos' : isMaria ? 'prof.maria' : 'admin';
  const author = isCarlos
    ? 'Prof. Carlos Hurtado Valer'
    : isMaria
      ? 'Prof. María Quispe Rojas'
      : 'Equipo pedagógico I.E. Micaela Bastidas';

  return {
    id: index + 1,
    title: seed.title,
    areaId: seed.areaId,
    grade: seed.grade,
    format: seed.format,
    type: seed.type,
    description: seed.description,
    author,
    featured: index < 9,
    status: 'publicado',
    createdBy: author,
    creatorUsername,
    createdAt: '2026-03-01',
    duration: seed.duration,
    difficulty: seed.difficulty,
    topics: seed.topics,
    steps: seed.steps,
    assignedGrades: seed.type === 'Actividad' ? [seed.grade] : undefined,
    fileName: `${seed.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${seed.format.toLowerCase()}`,
  };
});

export function isDocument(resource: LibraryResource): boolean {
  return resource.type !== 'Video' && resource.type !== 'Actividad';
}

export function isVideo(resource: LibraryResource): boolean {
  return resource.type === 'Video';
}

export function isActivity(resource: LibraryResource): boolean {
  return resource.type === 'Actividad';
}
