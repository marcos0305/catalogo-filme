import { Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { DetalheFilmeComponent } from '../app/catalogo/detalhe-filme/detalhe-filme.component';

export const routes: Routes = [
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'catalogo/:id', component: DetalheFilmeComponent } 
];
