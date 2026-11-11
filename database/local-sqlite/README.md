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



esta es la base de datos esta en 2 con su js, es la proimera version de la base de datos
macklein@pop-os:~/Descargas$
macklein@pop-os:~/Descargas$ cd 'Antigravity IDE'
ls -la
total 245484
drwxr-xr-x 5 macklein macklein      4096 oct 26 13:22 .
drwxr-xr-x 5 macklein macklein      4096 nov  6 15:29 ..
-rwxr-xr-x 1 macklein macklein 199855320 oct 26 13:22 antigravity-ide
drwxr-xr-x 2 macklein macklein      4096 oct 26 13:22 bin
-rw-r--r-- 1 macklein macklein    115176 oct 26 13:22 chrome_100_percent.pak
-rw-r--r-- 1 macklein macklein    188186 oct 26 13:22 chrome_200_percent.pak
-rwxr-xr-x 1 macklein macklein   1545800 oct 26 13:22 chrome_crashpad_handler
-rwxr-xr-x 1 macklein macklein     15328 oct 26 13:22 chrome-sandbox
-rw-r--r-- 1 macklein macklein  10467680 oct 26 13:22 icudtl.dat
-rwxr-xr-x 1 macklein macklein    251224 oct 26 13:22 libEGL.so
-rwxr-xr-x 1 macklein macklein   2681808 oct 26 13:22 libffmpeg.so
-rwxr-xr-x 1 macklein macklein   6343984 oct 26 13:22 libGLESv2.so
-rwxr-xr-x 1 macklein macklein   4703008 oct 26 13:22 libvk_swiftshader.so
-rwxr-xr-x 1 macklein macklein   2379040 oct 26 13:22 libvulkan.so.1
-rw-r--r-- 1 macklein macklein  15102119 oct 26 13:22 LICENSES.chromium.html
drwxr-xr-x 2 macklein macklein      4096 oct 26 13:22 locales
drwxr-xr-x 4 macklein macklein      4096 oct 26 13:22 resources
-rw-r--r-- 1 macklein macklein   6490319 oct 26 13:22 resources.pak
-rw-r--r-- 1 macklein macklein    403834 oct 26 13:22 snapshot_blob.bin
-rw-r--r-- 1 macklein macklein    776865 oct 26 13:22 v8_context_snapshot.bin
-rw-r--r-- 1 macklein macklein       107 oct 26 13:22 vk_swiftshader_icd.json
macklein@pop-os:~/Descargas/Antigravity IDE$ chmod +x *
./antigravity
bash: ./antigravity: No existe el archivo o el directorio
macklein@pop-os:~/Descargas/Antigravity IDE$