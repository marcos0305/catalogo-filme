import { Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoComponent }
];
