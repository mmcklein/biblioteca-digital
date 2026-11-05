import { Routes } from '@angular/router';
import { Acerca } from './features/institucional/acerca/acerca';
import { Inicio } from './features/institucional/inicio/inicio';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', component: Inicio },
  { path: 'acerca', component: Acerca },
  { path: '**', redirectTo: 'inicio' },
];
