-- ============================================================================
-- BASE DE DATOS LOCAL SQLITE - BIBLIOTECA DIGITAL
-- Institución Educativa Secundaria Micaela Bastidas Puyucahua (Tamburco, Abancay)
-- ============================================================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ----------------------------------------------------------------------------
-- 1. ÁREAS CURRICULARES (11 Áreas Oficiales del Currículo Nacional Secundaria)
-- Nota: Los IDs van de 0 a 10 para mantener paridad exacta con curriculum.ts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS curricular_areas (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  color TEXT,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- ----------------------------------------------------------------------------
-- 2. USUARIOS Y ROLES
-- Roles admitidos: ADMINISTRADOR, DOCENTE, ESTUDIANTE, PADRE_FAMILIA
-- Nota: Para estudiantes (menores de edad) no se guarda teléfono (Ley 29733)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE', 'PADRE_FAMILIA')),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  email TEXT,
  phone TEXT,
  reading_interests TEXT, -- JSON array de temas de lectura
  area_id INTEGER REFERENCES curricular_areas(id) ON DELETE SET NULL, -- Asignación de área para docentes
  grade INTEGER CHECK (grade IS NULL OR (grade BETWEEN 1 AND 5)), -- Grado escolar (1.º a 5.º) para estudiantes
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_users_grade ON users(grade);

-- ----------------------------------------------------------------------------
-- 3. RECURSOS EDUCATIVOS (Libros, Guías, Fichas, Investigaciones, Presentaciones, Actividades y Videos)
-- Los archivos físicos no se guardan en BD; solo se registra file_path relativo
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  area_id INTEGER NOT NULL REFERENCES curricular_areas(id) ON DELETE RESTRICT,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 5),
  format TEXT NOT NULL CHECK (format IN ('PDF', 'DOCX', 'PPT', 'MP4', 'ePub')),
  type TEXT NOT NULL CHECK (type IN ('Libro', 'Guía', 'Ficha', 'Investigación', 'Presentación', 'Actividad', 'Video')),
  description TEXT,
  author TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'publicado' CHECK (status IN ('publicado', 'retirado', 'borrador')),
  file_path TEXT, -- Ruta relativa de almacenamiento (ej: libros/matematica-1ro-ecuaciones.pdf)
  file_name TEXT,
  duration TEXT, -- Para videos (ej: '11:45') o actividades (ej: '30 min')
  difficulty TEXT CHECK (difficulty IS NULL OR difficulty IN ('Básico', 'Intermedio', 'Avanzado')),
  topics TEXT, -- JSON array de temas clave
  steps TEXT,  -- JSON array de pasos prácticos (para actividades)
  assigned_grades TEXT, -- JSON array de grados asignados (ej: [1, 2])
  created_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_resources_area_id ON resources(area_id);
CREATE INDEX IF NOT EXISTS idx_resources_grade ON resources(grade);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_format ON resources(format);
CREATE INDEX IF NOT EXISTS idx_resources_created_by ON resources(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_resources_search ON resources(status, area_id, grade);

-- ----------------------------------------------------------------------------
-- 4. APUNTES Y RESOLUCIÓN PRIVADA DE ACTIVIDADES (Solo Estudiante)
-- Privado para el estudiante: sin seguimiento académico ni notas evaluativas
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_activity_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_steps TEXT NOT NULL DEFAULT '[]', -- JSON array con índices de pasos completados
  student_note TEXT, -- Apuntes o reflexiones personales
  completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT uq_student_activity UNIQUE (resource_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_notes_user_resource ON student_activity_notes(user_id, resource_id);

-- ----------------------------------------------------------------------------
-- 5. AUDITORÍA LOCAL DE OPERACIONES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  action TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  entity TEXT,
  entity_id INTEGER,
  details TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);

-- ----------------------------------------------------------------------------
-- 6. COLA DE SINCRONIZACIÓN OFFLINE-FIRST (Para sincronización con PostgreSQL central)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  entity TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  payload TEXT NOT NULL, -- JSON con el estado de la entidad
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  synced INTEGER NOT NULL DEFAULT 0 CHECK (synced IN (0, 1)),
  synced_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(synced, created_at);

-- ----------------------------------------------------------------------------
-- 7. FAVORITOS / MARCADORES DEL USUARIO
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, resource_id)
);

-- ----------------------------------------------------------------------------
-- 8. HISTORIAL LOCAL DE DESCARGAS (Acceso offline local)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS download_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  downloaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_download_history_user ON download_history(user_id);

-- ----------------------------------------------------------------------------
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA DE updated_at
-- ----------------------------------------------------------------------------
CREATE TRIGGER IF NOT EXISTS trg_users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  UPDATE users SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_resources_updated_at
AFTER UPDATE ON resources
FOR EACH ROW
BEGIN
  UPDATE resources SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_activity_notes_updated_at
AFTER UPDATE ON student_activity_notes
FOR EACH ROW
BEGIN
  UPDATE student_activity_notes SET updated_at = datetime('now') WHERE id = OLD.id;
END;

