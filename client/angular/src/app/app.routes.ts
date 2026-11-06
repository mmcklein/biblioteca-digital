import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin.guard';
import { authGuard } from './core/auth/auth.guard';
import { docenteGuard } from './core/auth/docente.guard';
import { Actividades } from './features/actividades/actividades';
import { Admin } from './features/admin/admin';
import { Login } from './features/auth/login/login';
import { Areas } from './features/catalogo/areas/areas';
import { Grados } from './features/catalogo/grados/grados';
import { Libros } from './features/catalogo/libros/libros';
import { Docente } from './features/docente/docente';
import { Estudiante } from './features/estudiante/estudiante';
import { Padre } from './features/padre/padre';
import { Perfil } from './features/perfil/perfil';
import { Acerca } from './features/institucional/acerca/acerca';
import { Inicio } from './features/institucional/inicio/inicio';
import { Videos } from './features/videos/videos';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', component: Inicio },
  { path: 'acerca', component: Acerca },
  { path: 'areas', component: Areas },
  { path: 'grados', component: Grados },
  { path: 'libros', component: Libros },
  { path: 'videos', component: Videos },
  { path: 'actividades', component: Actividades },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: 'docente', component: Docente, canActivate: [docenteGuard] },
  { path: 'estudiante', component: Estudiante, canActivate: [authGuard] },
  { path: 'padre', component: Padre, canActivate: [authGuard] },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'inicio' },
];
