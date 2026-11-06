/**
 * Script de inicialización y verificación de la Base de Datos Local SQLite
 * Biblioteca Digital - I.E. Secundaria Micaela Bastidas Puyucahua
 *
 * Utiliza el módulo nativo de alto rendimiento `node:sqlite` (Node.js 22+)
 */

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const BASE_DIR = __dirname;
const DB_PATH = path.join(BASE_DIR, 'biblioteca.db');
const SCHEMA_PATH = path.join(BASE_DIR, 'schema.sql');
const SEEDS_PATH = path.join(BASE_DIR, 'seeds.sql');

// Carpetas de almacenamiento local de archivos
const STORAGE_ROOT = path.resolve(BASE_DIR, '../../storage');
const STORAGE_DIRS = [
  path.join(STORAGE_ROOT, 'libros'),
  path.join(STORAGE_ROOT, 'guias'),
  path.join(STORAGE_ROOT, 'videos'),
  path.join(STORAGE_ROOT, 'actividades'),
  path.join(STORAGE_ROOT, 'portadas'),
  path.join(STORAGE_ROOT, 'respaldos'),
];

function ensureStorageDirectories() {
  console.log('📁 Verificando directorios de almacenamiento físico...');
  for (const dir of STORAGE_DIRS) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      // Crear .gitkeep para control de versiones
      const gitkeep = path.join(dir, '.gitkeep');
      if (!fs.existsSync(gitkeep)) {
        fs.writeFileSync(gitkeep, '');
      }
      console.log(`  + Creada carpeta: ${path.relative(path.resolve(BASE_DIR, '../..'), dir)}/`);
    }
  }
}

function initializeDatabase() {
  console.log('🚀 Inicializando Base de Datos Local SQLite: biblioteca.db');
  ensureStorageDirectories();

  // Si existe base de datos previa, la reutilizamos o inicializamos limpiamente
  const db = new DatabaseSync(DB_PATH);

  try {
    // 1. Configuración de PRAGMAs indispensables para integridad y concurrencia
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec('PRAGMA journal_mode = WAL;');

    const walMode = db.prepare('PRAGMA journal_mode;').get();
    console.log(`⚙️  Modo de diario SQLite: ${walMode.journal_mode.toUpperCase()}`);

    const fkStatus = db.prepare('PRAGMA foreign_keys;').get();
    console.log(`🔒 Claves foráneas activadas: ${fkStatus.foreign_keys === 1 ? 'SÍ' : 'NO'}`);

    // 2. Ejecutar Schema DDL
    console.log('📄 Aplicando esquema DDL (schema.sql)...');
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    db.exec(schemaSql);
    console.log('✅ Esquema creado satisfactoriamente.');

    // 3. Ejecutar Seeds DML
    console.log('🌱 Sembrando datos institucionales (seeds.sql)...');
    const seedsSql = fs.readFileSync(SEEDS_PATH, 'utf-8');
    db.exec(seedsSql);
    console.log('✅ Datos semilla cargados satisfactoriamente.');

    // 4. PRAGMA integrity_check
    console.log('🔍 Ejecutando verificación de integridad (integrity_check)...');
    const integrity = db.prepare('PRAGMA integrity_check;').get();
    if (integrity.integrity_check !== 'ok') {
      throw new Error(`Fallo en prueba de integridad SQLite: ${integrity.integrity_check}`);
    }
    console.log('✅ PRAGMA integrity_check: OK');

    // 5. Verificaciones funcionales solicitadas
    runVerificationTests(db);

    console.log('\n🎉 ¡Base de datos local inicializada exitosamente en:');
    console.log(`   ${DB_PATH}\n`);
  } finally {
    db.close();
  }
}

function runVerificationTests(db) {
  console.log('\n🧪 Ejecutando pruebas de validación de reglas de negocio:');

  // A. Comprobar 11 áreas curriculares
  const areasCount = db.prepare('SELECT COUNT(*) as count FROM curricular_areas;').get().count;
  console.log(`  [1/4] Áreas curriculares registradas: ${areasCount} (Esperado: 11)`);
  if (areasCount !== 11) {
    throw new Error(`Se esperaban 11 áreas curriculares, pero se encontraron ${areasCount}`);
  }

  // B. Comprobar los 4 roles de usuario definidos
  const rolesRow = db.prepare(`
    SELECT
      SUM(CASE WHEN role = 'ADMINISTRADOR' THEN 1 ELSE 0 END) as admin_count,
      SUM(CASE WHEN role = 'DOCENTE' THEN 1 ELSE 0 END) as docente_count,
      SUM(CASE WHEN role = 'ESTUDIANTE' THEN 1 ELSE 0 END) as estudiante_count,
      SUM(CASE WHEN role = 'PADRE_FAMILIA' THEN 1 ELSE 0 END) as padre_count,
      COUNT(*) as total
    FROM users;
  `).get();

  console.log(`  [2/4] Usuarios registrados: ${rolesRow.total} con los 4 roles requeridos:`);
  console.log(`        - ADMINISTRADOR: ${rolesRow.admin_count}`);
  console.log(`        - DOCENTE: ${rolesRow.docente_count}`);
  console.log(`        - ESTUDIANTE: ${rolesRow.estudiante_count}`);
  console.log(`        - PADRE_FAMILIA: ${rolesRow.padre_count}`);

  if (
    rolesRow.admin_count < 1 ||
    rolesRow.docente_count < 1 ||
    rolesRow.estudiante_count < 1 ||
    rolesRow.padre_count < 1
  ) {
    throw new Error('Faltan usuarios de alguno de los 4 roles obligatorios.');
  }

  // Comprobar Ley 29733: El estudiante no tiene teléfono registrado
  const studentPhone = db.prepare("SELECT phone FROM users WHERE role = 'ESTUDIANTE';").get();
  if (studentPhone && studentPhone.phone !== null) {
    throw new Error('Violación Ley 29733: El estudiante no debe tener teléfono registrado.');
  }
  console.log('        ✓ Protección de datos de menores (Ley 29733): Sin teléfono para estudiantes.');

  // C. Comprobar catálogo de recursos
  const resourcesRow = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN type IN ('Libro', 'Guía', 'Ficha', 'Investigación', 'Presentación') THEN 1 ELSE 0 END) as docs,
      SUM(CASE WHEN type = 'Video' THEN 1 ELSE 0 END) as videos,
      SUM(CASE WHEN type = 'Actividad' THEN 1 ELSE 0 END) as actividades
    FROM resources;
  `).get();

  console.log(`  [3/4] Recursos en catálogo: ${resourcesRow.total} materiales:`);
  console.log(`        - Documentos y libros: ${resourcesRow.docs}`);
  console.log(`        - Videos educativos: ${resourcesRow.videos}`);
  console.log(`        - Actividades pedagógicas: ${resourcesRow.actividades}`);

  if (resourcesRow.total < 30) {
    throw new Error(`Catálogo incompleto: se encontraron ${resourcesRow.total} recursos.`);
  }

  // D. Comprobar rechazo estricto de claves foráneas inválidas
  let fkRejected = false;
  try {
    // Intentar insertar un recurso con un area_id inexistente (ej: 9999)
    db.prepare(`
      INSERT INTO resources (title, area_id, grade, format, type, author)
      VALUES ('Prueba Invalida', 9999, 1, 'PDF', 'Libro', 'Autor Invalido');
    `).run();
  } catch (err) {
    fkRejected = true;
  }

  if (!fkRejected) {
    throw new Error('Fallo de seguridad: SQLite permitió insertar una clave foránea inválida.');
  }
  console.log('  [4/4] Claves foráneas: Rechazan exitosamente registros inválidos (FK constraint OK).');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  try {
    initializeDatabase();
  } catch (err) {
    console.error('❌ Error durante la inicialización de la base de datos:', err);
    process.exit(1);
  }
}

module.exports = { initializeDatabase, DB_PATH };

