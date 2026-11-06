-- ============================================================================
-- DATOS SEMILLA (SEEDS) - BASE DE DATOS LOCAL SQLITE
-- Biblioteca Digital - I.E. Secundaria Micaela Bastidas Puyucahua
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ÁREAS CURRICULARES (11 Áreas Oficiales - IDs 0 al 10)
-- ----------------------------------------------------------------------------
INSERT OR REPLACE INTO curricular_areas (id, name, icon, color, description, order_index) VALUES
(0, 'Matemática', '📐', '#ddba7c', 'Razonamiento lógico, números y resolución de problemas', 1),
(1, 'Comunicación', '📖', '#d8c5ab', 'Lectura comprensiva, expresión oral y redacción', 2),
(2, 'Ciencia y Tecnología', '🔬', '#a8cdb3', 'Indagación científica, biología y física aplicada', 3),
(3, 'Ciencias Sociales', '🌎', '#c0bfd8', 'Historia del Perú, geografía y economía', 4),
(4, 'Inglés', '🔤', '#b8d6e9', 'Comunicación en lengua extranjera', 5),
(5, 'Arte y Cultura', '🎨', '#e5b5ab', 'Apreciación artística, música y artes visuales', 6),
(6, 'Educación Física', '⚽', '#b4d2bc', 'Desarrollo corporal y vida saludable', 7),
(7, 'Educación para el Trabajo', '💻', '#ddd2a3', 'Emprendimiento, computación y proyectos productivos', 8),
(8, 'Tutoría y Convivencia', '🤝', '#c8d4e3', 'Acompañamiento socioafectivo y valores', 9),
(9, 'Educación Religiosa', '🕊️', '#e3cfb0', 'Dimensión trascendente y ética', 10),
(10, 'Educación para la Ciudadanía Global', '🌐', '#c5b8d9', 'Derechos humanos y participación ciudadana', 11);

-- ----------------------------------------------------------------------------
-- 2. USUARIOS DE DEMOSTRACIÓN (Nombres neutros por rol)
-- Contraseña genérica de prueba: 'bastidas2026'
-- Hash bcrypt estándar ($2a$12$e8Fv2.R7sIuJ8o0V0DkJNu7GqW9P7yE8v0s8kG6nK1oXvY6kQ0r8y)
-- ----------------------------------------------------------------------------
INSERT OR REPLACE INTO users (id, username, password_hash, name, role, active, email, phone, reading_interests, area_id, grade, created_at) VALUES
(1, 'admin', '$2a$12$e8Fv2.R7sIuJ8o0V0DkJNu7GqW9P7yE8v0s8kG6nK1oXvY6kQ0r8y', 'Administrador Demo', 'ADMINISTRADOR', 1, 'admin@bastidas.edu.pe', '983000001', '["Gestión Educativa", "Tecnología"]', NULL, NULL, '2026-03-01 08:00:00'),
(2, 'prof.docente1', '$2a$12$e8Fv2.R7sIuJ8o0V0DkJNu7GqW9P7yE8v0s8kG6nK1oXvY6kQ0r8y', 'Docente Demo 1', 'DOCENTE', 1, 'docente1@bastidas.edu.pe', '983000002', '["Matemática", "Resolución de Problemas"]', 0, NULL, '2026-03-02 08:00:00'),
(3, 'prof.docente2', '$2a$12$e8Fv2.R7sIuJ8o0V0DkJNu7GqW9P7yE8v0s8kG6nK1oXvY6kQ0r8y', 'Docente Demo 2', 'DOCENTE', 1, 'docente2@bastidas.edu.pe', '983000003', '["Literatura", "Comprensión Lectora"]', 1, NULL, '2026-03-02 08:00:00'),
(4, 'estudiante.demo', '$2a$12$e8Fv2.R7sIuJ8o0V0DkJNu7GqW9P7yE8v0s8kG6nK1oXvY6kQ0r8y', 'Estudiante Demo', 'ESTUDIANTE', 1, 'estudiante@bastidas.edu.pe', NULL, '["Ciencia", "Historia"]', NULL, 3, '2026-03-10 08:00:00'),
(5, 'padre.demo', '$2a$12$e8Fv2.R7sIuJ8o0V0DkJNu7GqW9P7yE8v0s8kG6nK1oXvY6kQ0r8y', 'Padre de Familia Demo', 'PADRE_FAMILIA', 1, 'familia@bastidas.edu.pe', '983000005', '["Orientación Vocacional", "Salud"]', NULL, NULL, '2026-03-12 08:00:00');

-- ----------------------------------------------------------------------------
-- 3. RECURSOS EDUCATIVOS (Catálogo inicial correspondiente a resources.ts)
-- Rutas relativas organizadas por carpetas: libros/, guias/, videos/, actividades/
-- ----------------------------------------------------------------------------
INSERT OR REPLACE INTO resources (
  id, title, area_id, grade, format, type, description, author, featured, status,
  file_path, file_name, duration, difficulty, topics, steps, assigned_grades, created_by_user_id, created_at
) VALUES
-- Libros y Documentos (1-14)
(1, 'Ecuaciones de primer grado', 0, 1, 'PDF', 'Libro', 'Aprende a resolver ecuaciones paso a paso con problemas de la vida cotidiana.', 'Docente Demo 1', 1, 'publicado', 'libros/ecuaciones_de_primer_grado.pdf', 'ecuaciones_de_primer_grado.pdf', NULL, NULL, NULL, NULL, NULL, 2, '2026-03-01 08:00:00'),
(2, 'El texto narrativo', 1, 2, 'PDF', 'Guía', 'Estructura, tipos de narrador, personajes y estrategias de comprensión lectora.', 'Docente Demo 2', 1, 'publicado', 'guias/el_texto_narrativo.pdf', 'el_texto_narrativo.pdf', NULL, NULL, NULL, NULL, NULL, 3, '2026-03-01 08:00:00'),
(3, 'La célula y sus funciones', 2, 3, 'PDF', 'Libro', 'La unidad básica de la vida, organelos celulares y diferencias entre célula animal y vegetal.', 'Equipo pedagógico I.E. Micaela Bastidas', 1, 'publicado', 'libros/la_celula_y_sus_funciones.pdf', 'la_celula_y_sus_funciones.pdf', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-01 08:00:00'),
(4, 'Civilizaciones de la Antigüedad', 3, 2, 'PDF', 'Libro', 'Historia, legado cultural y organización social de las grandes civilizaciones.', 'Equipo pedagógico I.E. Micaela Bastidas', 1, 'publicado', 'libros/civilizaciones_de_la_antiguedad.pdf', 'civilizaciones_de_la_antiguedad.pdf', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-01 08:00:00'),
(5, 'Present Simple', 4, 3, 'PPT', 'Presentación', 'Introducción al tiempo presente simple en inglés con reglas gramaticales y ejemplos.', 'Equipo pedagógico I.E. Micaela Bastidas', 1, 'publicado', 'libros/present_simple.ppt', 'present_simple.ppt', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-01 08:00:00'),
(6, 'Técnicas de pintura', 5, 2, 'PDF', 'Ficha', 'Teoría del color, círculo cromático, composición plástica y creatividad.', 'Equipo pedagógico I.E. Micaela Bastidas', 1, 'publicado', 'libros/tecnicas_de_pintura.pdf', 'tecnicas_de_pintura.pdf', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-01 08:00:00'),
(7, 'Hábitos para una vida saludable', 6, 1, 'PDF', 'Ficha', 'Nutrición balanceada, hidratación y rutinas de calentamiento físico.', 'Equipo pedagógico I.E. Micaela Bastidas', 1, 'publicado', 'libros/habitos_para_una_vida_saludable.pdf', 'habitos_para_una_vida_saludable.pdf', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-01 08:00:00'),
(8, 'Emprendimiento e idea de negocio', 7, 4, 'DOCX', 'Guía', 'Pasos para estructurar un modelo de negocio local, lienzo Lean Canvas y presupuesto.', 'Equipo pedagógico I.E. Micaela Bastidas', 1, 'publicado', 'guias/emprendimiento_e_idea_de_negocio.docx', 'emprendimiento_e_idea_de_negocio.docx', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-01 08:00:00'),
(9, 'Valores y comunidad', 9, 1, 'PDF', 'Libro', 'Reflexión sobre la solidaridad, el respeto y la convivencia comunitaria.', 'Equipo pedagógico I.E. Micaela Bastidas', 1, 'publicado', 'libros/valores_y_comunidad.pdf', 'valores_y_comunidad.pdf', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-01 08:00:00'),
(10, 'Ciudadanía y derechos humanos', 10, 5, 'PDF', 'Guía', 'Participación ciudadana responsable, democracia y defensa de los derechos fundamentales.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'guias/ciudadania_y_derechos_humanos.pdf', 'ciudadania_y_derechos_humanos.pdf', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-01 08:00:00'),
(11, 'Matemática para todos', 0, 4, 'PDF', 'Libro', 'Razonamiento lógico-matemático, trigonometría básica y funciones aplicadas.', 'Docente Demo 1', 0, 'publicado', 'libros/matematica_para_todos.pdf', 'matematica_para_todos.pdf', NULL, NULL, NULL, NULL, NULL, 2, '2026-03-01 08:00:00'),
(12, 'Investigación: Independencia del Perú', 3, 4, 'PDF', 'Investigación', 'Un recorrido analítico por el proceso independentista y los próceres de la patria.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'libros/investigacion_independencia_del_peru.pdf', 'investigacion_independencia_del_peru.pdf', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-01 08:00:00'),
(13, 'English for Teens', 4, 2, 'PDF', 'Libro', 'Vocabulario esencial, diálogos situacionales y expresiones comunes en inglés.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'libros/english_for_teens.pdf', 'english_for_teens.pdf', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-01 08:00:00'),
(14, 'Manual de primeros auxilios', 2, 5, 'PDF', 'Guía', 'Protocolos de atención inicial en la escuela ante caídas, heridas y emergencias.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'guias/manual_de_primeros_auxilios.pdf', 'manual_de_primeros_auxilios.pdf', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-01 08:00:00'),

-- Videos Educativos (15-22)
(15, 'El ciclo del agua', 2, 3, 'MP4', 'Video', 'Explicación dinámica de la evaporación, condensación, precipitación e infiltración.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'videos/el_ciclo_del_agua.mp4', 'el_ciclo_del_agua.mp4', '11:45', NULL, '["Evaporación", "Condensación", "Cuencas hidrográficas"]', NULL, NULL, 1, '2026-03-01 08:00:00'),
(16, 'Historia del Perú: El Tahuantinsuyo', 3, 2, 'MP4', 'Video', 'Organización política, social y cosmovisión andina en el imperio incaico.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'videos/historia_del_peru_el_tahuantinsuyo.mp4', 'historia_del_peru_el_tahuantinsuyo.mp4', '15:20', NULL, '["Incas", "Chasquis", "Ayllu", "Cusco y Tamburco"]', NULL, NULL, 1, '2026-03-01 08:00:00'),
(17, 'Matemática fácil: Fracciones y decimales', 0, 1, 'MP4', 'Video', 'Aprende a sumar y restar fracciones heterogéneas con gráficos interactivos.', 'Docente Demo 1', 0, 'publicado', 'videos/matematica_facil_fracciones_y_decimales.mp4', 'matematica_facil_fracciones_y_decimales.mp4', '08:35', NULL, '["Fracciones equivalentes", "MCM", "Conversión a decimal"]', NULL, NULL, 2, '2026-03-01 08:00:00'),
(18, 'Verbos en Present Simple', 4, 3, 'MP4', 'Video', 'Pronunciación y uso de verbos regulares e irregulares en oraciones afirmativas y negativas.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'videos/verbos_en_present_simple.mp4', 'verbos_en_present_simple.mp4', '09:50', NULL, '["Grammar rules", "Third person -s/-es", "Daily routines"]', NULL, NULL, 1, '2026-03-01 08:00:00'),
(19, 'Técnicas de pintura: Acuarela y paisaje andino', 5, 4, 'MP4', 'Video', 'Paso a paso para pintar paisajes con técnica de aguadas, luces y sombras.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'videos/tecnicas_de_pintura_acuarela_y_paisaje_andino.mp4', 'tecnicas_de_pintura_acuarela_y_paisaje_andino.mp4', '14:10', NULL, '["Paleta de colores", "Papel de acuarela", "Difuminados"]', NULL, NULL, 1, '2026-03-01 08:00:00'),
(20, 'Experimentos científicos caseros', 2, 4, 'MP4', 'Video', 'Demostración de reacciones químicas seguras para comprobar la ley de conservación.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'videos/experimentos_cientificos_caseros.mp4', 'experimentos_cientificos_caseros.mp4', '12:05', NULL, '["Método científico", "Reacciones químicas", "Seguridad"]', NULL, NULL, 1, '2026-03-01 08:00:00'),
(21, 'Ecosistemas de la región Apurímac', 2, 1, 'MP4', 'Video', 'Biodiversidad de la flora y fauna en los valles interandinos y punas de Apurímac.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'videos/ecosistemas_de_la_region_apurimac.mp4', 'ecosistemas_de_la_region_apurimac.mp4', '13:30', NULL, '["Fauna local", "Pisos altitudinales", "Conservación"]', NULL, NULL, 1, '2026-03-01 08:00:00'),
(22, 'Programación básica con algoritmos', 7, 5, 'MP4', 'Video', 'Introducción a variables, condicionales y ciclos con diagramas de flujo interactivos.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'videos/programacion_basica_con_algoritmos.mp4', 'programacion_basica_con_algoritmos.mp4', '16:40', NULL, '["Pseudocódigo", "Condicionales Si/No", "Bucles"]', NULL, NULL, 1, '2026-03-01 08:00:00'),

-- Actividades Pedagógicas (23-30)
(23, 'Convivencia escolar y asertividad', 8, 2, 'PDF', 'Actividad', 'Taller práctico con dinámicas de grupo para la resolución pacífica de conflictos en el aula.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'actividades/convivencia_escolar_y_asertividad.pdf', 'convivencia_escolar_y_asertividad.pdf', '30 min', 'Básico', NULL, '["Lectura de un caso de desacuerdo entre compañeros", "Identificación de emociones y posturas de cada parte", "Redacción de dos acuerdos consensuados en equipo"]', '[2]', 1, '2026-03-01 08:00:00'),
(24, 'Fichas didácticas de comprensión lectora', 1, 1, 'DOCX', 'Actividad', 'Textos cortos con preguntas de nivel literal, inferencial y crítico para practicar.', 'Docente Demo 2', 0, 'publicado', 'actividades/fichas_didacticas_de_comprension_lectora.docx', 'fichas_didacticas_de_comprension_lectora.docx', '40 min', 'Básico', NULL, '["Lectura en voz alta del mito de origen andino", "Subrayado de palabras clave y conectores lógicos", "Desarrollo del cuestionario de 5 preguntas"]', '[1]', 3, '2026-03-01 08:00:00'),
(25, 'Laboratorio de razones y proporciones', 0, 2, 'PDF', 'Actividad', 'Problemas de proporcionalidad directa e inversa aplicados a recetas y distancias.', 'Docente Demo 1', 0, 'publicado', 'actividades/laboratorio_de_razones_y_proporciones.pdf', 'laboratorio_de_razones_y_proporciones.pdf', '45 min', 'Intermedio', NULL, '["Completar tablas de valores proporcionales", "Graficar pares ordenados en el plano cartesiano", "Calcular la constante de proporcionalidad"]', '[2]', 2, '2026-03-01 08:00:00'),
(26, 'Taller de argumentación y debate', 1, 3, 'PDF', 'Actividad', 'Estructuración de tesis, argumentos de causa-efecto y preparación para mesas redondas.', 'Docente Demo 2', 0, 'publicado', 'actividades/taller_de_argumentacion_y_debate.pdf', 'taller_de_argumentacion_y_debate.pdf', '50 min', 'Intermedio', NULL, '["Elección de un tema de interés escolar o ambiental", "Búsqueda de 2 evidencias que sustenten la postura", "Simulación de debate de 3 minutos por participante"]', '[3]', 3, '2026-03-01 08:00:00'),
(27, 'Geometría y figuras del entorno', 0, 1, 'PDF', 'Actividad', 'Identificación de polígonos regulares e irregulares en la arquitectura escolar.', 'Docente Demo 1', 0, 'publicado', 'actividades/geometria_y_figuras_del_entorno.pdf', 'geometria_y_figuras_del_entorno.pdf', '35 min', 'Básico', NULL, '["Medir los lados de objetos rectangulares del aula", "Calcular perímetros y áreas con fórmulas básicas", "Diseñar un croquis a escala en papel milimetrado"]', '[1]', 2, '2026-03-01 08:00:00'),
(28, 'Proyecto de reciclaje escolar', 2, 1, 'PDF', 'Actividad', 'Guía de campo para clasificar residuos sólidos y elaborar compostaje orgánico.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'actividades/proyecto_de_reciclaje_escolar.pdf', 'proyecto_de_reciclaje_escolar.pdf', '60 min', 'Básico', NULL, '["Monitoreo semanal del tipo de residuos en el colegio", "Separación por contenedores de color normado", "Elaboración de cartel informativo para la comunidad"]', '[1]', 1, '2026-03-01 08:00:00'),
(29, 'Línea de tiempo histórica del Perú', 3, 1, 'PDF', 'Actividad', 'Construcción colaborativa de una línea de tiempo desde el periodo prehispánico.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'actividades/linea_de_tiempo_historica_del_peru.pdf', 'linea_de_tiempo_historica_del_peru.pdf', '40 min', 'Intermedio', NULL, '["Ordenar cronológicamente 8 sucesos clave", "Asignar imágenes o ilustraciones representativas", "Escribir una conclusión sobre el impacto en el presente"]', '[1]', 1, '2026-03-01 08:00:00'),
(30, 'Reto de pensamiento crítico y ciudadanía', 10, 5, 'PDF', 'Actividad', 'Análisis de dilemas éticos y formulación de propuestas de mejora comunitaria.', 'Equipo pedagógico I.E. Micaela Bastidas', 0, 'publicado', 'actividades/reto_de_pensamiento_critico_y_ciudadania.pdf', 'reto_de_pensamiento_critico_y_ciudadania.pdf', '50 min', 'Avanzado', NULL, '["Lectura del dilema sobre uso responsable del agua", "Evaluación de ventajas y desventajas por grupo de interés", "Redacción de un acta de compromiso con propuestas reales"]', '[5]', 1, '2026-03-01 08:00:00');

-- ----------------------------------------------------------------------------
-- 4. REGISTRO INICIAL DE AUDITORÍA
-- ----------------------------------------------------------------------------
INSERT OR REPLACE INTO audit_logs (id, timestamp, action, user_id, entity, entity_id, details) VALUES
(1, '2026-03-01 08:00:00', 'Inicialización de Base de Datos', 1, 'system', 0, 'Carga inicial de 11 áreas curriculares y catálogo institucional');

