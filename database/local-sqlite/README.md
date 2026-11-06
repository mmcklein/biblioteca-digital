# Base de Datos Local SQLite - Biblioteca Digital

Base de datos relacional local diseñada bajo arquitectura **offline-first** para la **I.E. Secundaria Micaela Bastidas Puyucahua** (Tamburco, Abancay, Apurímac).

---

## 🏛️ Estructura de Tablas

1. **`curricular_areas`**: Las 11 áreas oficiales del Currículo Nacional (IDs del 0 al 10 en paridad con `curriculum.ts`).
2. **`users`**: Control de acceso y roles (`ADMINISTRADOR`, `DOCENTE`, `ESTUDIANTE`, `PADRE_FAMILIA`) con protección de datos de menores (Ley 29733: sin registro de teléfono para estudiantes).
3. **`resources`**: Catálogo completo de libros, guías, fichas, videos y actividades pedagógicas. Los archivos físicos residen en el sistema de archivos (`storage/`), guardando únicamente su ruta relativa.
4. **`student_activity_notes`**: Respuestas y apuntes privados del estudiante (sin notas evaluativas ni seguimiento académico).
5. **`audit_logs`**: Registro local de operaciones para supervisión del Administrador.
6. **`sync_queue`**: Cola de operaciones locales (`INSERT`, `UPDATE`, `DELETE`) para la futura sincronización bidireccional con PostgreSQL central.
7. **`favorites`**: Recursos marcados como favoritos por cada usuario.
8. **`download_history`**: Registro local de descargas de materiales para acceso sin conexión.

---

## 🚀 Cómo Inicializar y Verificar la Base de Datos

Desde la terminal en la raíz del proyecto o dentro de esta carpeta:

```bash
cd database/local-sqlite
node init-db.js
```

### Lo que realiza el script:
1. Crea o actualiza el archivo físico **`biblioteca.db`**.
2. Habilita el modo de diario de alto rendimiento **`WAL`** (`PRAGMA journal_mode = WAL`).
3. Activa la verificación estricta de **claves foráneas** (`PRAGMA foreign_keys = ON`).
4. Aplica el esquema DDL (**`schema.sql`**) con triggers de actualización de fecha y tiempos (`updated_at`).
5. Inserta los datos semilla (**`seeds.sql`**) con nombres neutros demostrativos y hashes seguros de contraseñas.
6. Crea las carpetas físicas de almacenamiento en `storage/` (`libros/`, `guias/`, `videos/`, `actividades/`, `portadas/`, `respaldos/`).
7. Ejecuta `PRAGMA integrity_check` y pruebas automatizadas de validación de áreas, roles, catálogo y rechazo de claves foráneas inválidas.

