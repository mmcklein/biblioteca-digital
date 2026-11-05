import { Routes } from '@angular/router';
import { Actividades } from './features/actividades/actividades';
import { Areas } from './features/catalogo/areas/areas';
import { Grados } from './features/catalogo/grados/grados';
import { Libros } from './features/catalogo/libros/libros';
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
  { path: '**', redirectTo: 'inicio' },
];
