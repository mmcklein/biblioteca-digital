# Biblioteca Digital

Aplicación de escritorio offline-first para la gestión de contenido educativo.

## Arquitectura

- **Cliente**: Angular + Electron
- **Servidor**: Node.js + Express
- **Base de datos local**: SQLite
- **Base de datos central**: PostgreSQL
- **Sincronización**: Cola de operaciones + backend en la nube

## Estructura del repositorio


## Equipo

| Integrante | Rol | Carpeta principal |
|------------|-----|-------------------|
| 1 | Coordinador + Electron | `client/electron/`, `scripts/` |
| 2 | Backend | `server/` |
| 3 | Bases de datos + sincronización | `database/`, `client/electron/services/` |
| 4 | Catálogo | `client/angular/src/app/features/catalogo/` |
| 5 | Videos y actividades | `client/angular/src/app/features/videos/`, `actividades/` |
| 6 | Diseño institucional | `client/angular/src/app/features/institucional/`, `shared/`, `assets/` |

## Ramas

- `main`: versión estable (protegida, requiere PR)
- `develop`: integración del equipo
- `feature/*`: ramas de trabajo por funcionalidad

## Primer objetivo

Lograr que una computadora pueda:
1. Instalar la aplicación
2. Iniciar sesión
3. Consultar información de prueba

Después: sincronización entre computadoras y funcionamiento sin Internet  oooo.
