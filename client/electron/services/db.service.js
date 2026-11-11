/**
 * Servicio de Acceso a Datos Local SQLite para Electron
 * Biblioteca Digital - I.E. Secundaria Micaela Bastidas Puyucahua
 *
 * Utiliza el módulo nativo de alto rendimiento `node:sqlite` (Node 22+)
 */

const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = path.resolve(__dirname, '../../../database/local-sqlite/biblioteca.db');

class DatabaseService {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_PATH)) {
      console.warn(`[DB Service] Base de datos no encontrada en: ${DB_PATH}. Inicializando...`);
      const { initializeDatabase } = require('../../../database/local-sqlite/init-db');
      initializeDatabase();
    }

    this.db = new DatabaseSync(DB_PATH);
    this.db.exec('PRAGMA foreign_keys = ON;');
    this.db.exec('PRAGMA journal_mode = WAL;');
    console.log('[DB Service] Conexión establecida con biblioteca.db en modo WAL.');
  }

  // --- Áreas Curriculares ---
  getAreas() {
    const stmt = this.db.prepare('SELECT * FROM curricular_areas ORDER BY order_index ASC;');
    return stmt.all();
  }

  // --- Usuarios y Autenticación ---
  getUserByUsername(username) {
    const stmt = this.db.prepare(`
      SELECT id, username, password_hash, name, role, active, email, phone, reading_interests, area_id, grade, created_at
      FROM users
      WHERE username = ? COLLATE NOCASE;
    `);
    const user = stmt.get(username);
    if (user && user.reading_interests) {
      try {
        user.reading_interests = JSON.parse(user.reading_interests);
      } catch {
        user.reading_interests = [];
      }
    }
    return user || null;
  }

  getUsers() {
    const stmt = this.db.prepare(`
      SELECT id, username, name, role, active, email, phone, reading_interests, area_id, grade, created_at
      FROM users
      ORDER BY id ASC;
    `);
    const users = stmt.all();
    return users.map((u) => {
      if (u.reading_interests) {
        try {
          u.reading_interests = JSON.parse(u.reading_interests);
        } catch {
          u.reading_interests = [];
        }
      }
      return u;
    });
  }

  // --- Recursos y Catálogo ---
  getResources(filters = {}) {
    let query = `
      SELECT r.*, a.name as area_name, a.icon as area_icon
      FROM resources r
      LEFT JOIN curricular_areas a ON r.area_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND r.status = ?';
      params.push(filters.status);
    } else {
      query += " AND r.status = 'publicado'";
    }

    if (filters.type) {
      query += ' AND r.type = ?';
      params.push(filters.type);
    }

    if (filters.grade) {
      query += ' AND r.grade = ?';
      params.push(Number(filters.grade));
    }

    if (filters.area_id !== undefined && filters.area_id !== '') {
      query += ' AND r.area_id = ?';
      params.push(Number(filters.area_id));
    }

    if (filters.q) {
      query += ' AND (r.title LIKE ? OR r.description LIKE ? OR r.author LIKE ?)';
      const term = `%${filters.q}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY r.id DESC;';

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...params);

    return rows.map((r) => {
      if (r.topics) {
        try { r.topics = JSON.parse(r.topics); } catch { r.topics = []; }
      }
      if (r.steps) {
        try { r.steps = JSON.parse(r.steps); } catch { r.steps = []; }
      }
      if (r.assigned_grades) {
        try { r.assigned_grades = JSON.parse(r.assigned_grades); } catch { r.assigned_grades = []; }
      }
      return r;
    });
  }

  getResourceById(id) {
    const stmt = this.db.prepare(`
      SELECT r.*, a.name as area_name, a.icon as area_icon
      FROM resources r
      LEFT JOIN curricular_areas a ON r.area_id = a.id
      WHERE r.id = ?;
    `);
    const r = stmt.get(Number(id));
    if (!r) return null;

    if (r.topics) {
      try { r.topics = JSON.parse(r.topics); } catch { r.topics = []; }
    }
    if (r.steps) {
      try { r.steps = JSON.parse(r.steps); } catch { r.steps = []; }
    }
    if (r.assigned_grades) {
      try { r.assigned_grades = JSON.parse(r.assigned_grades); } catch { r.assigned_grades = []; }
    }
    return r;
  }

  // --- Apuntes y Resolución de Actividades (Solo Estudiante Privado) ---
  getStudentActivityNote(resourceId, userId) {
    const stmt = this.db.prepare(`
      SELECT * FROM student_activity_notes
      WHERE resource_id = ? AND user_id = ?;
    `);
    const note = stmt.get(Number(resourceId), Number(userId));
    if (note && note.completed_steps) {
      try {
        note.completed_steps = JSON.parse(note.completed_steps);
      } catch {
        note.completed_steps = [];
      }
    }
    return note || null;
  }

  saveStudentActivityNote({ resourceId, userId, completedSteps, studentNote, completed }) {
    const stmt = this.db.prepare(`
      INSERT INTO student_activity_notes (resource_id, user_id, completed_steps, student_note, completed, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(resource_id, user_id) DO UPDATE SET
        completed_steps = excluded.completed_steps,
        student_note = excluded.student_note,
        completed = excluded.completed,
        updated_at = datetime('now');
    `);
    stmt.run(
      Number(resourceId),
      Number(userId),
      JSON.stringify(completedSteps || []),
      studentNote || '',
      completed ? 1 : 0
    );
    return { success: true };
  }

  // --- Auditoría Local ---
  recordAudit(action, userId, details, entity = 'desktop', entityId = null) {
    const stmt = this.db.prepare(`
      INSERT INTO audit_logs (timestamp, action, user_id, entity, entity_id, details)
      VALUES (datetime('now'), ?, ?, ?, ?, ?);
    `);
    stmt.run(action, userId || null, entity, entityId, details || '');
  }

  getAuditLogs(limit = 50) {
    const stmt = this.db.prepare(`
      SELECT a.*, u.name as user_name, u.role as user_role
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.id DESC
      LIMIT ?;
    `);
    return stmt.all(limit);
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

module.exports = new DatabaseService();

