import { RouterModule, Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { DetalheFilmeComponent } from '../app/catalogo/detalhe-filme/detalhe-filme.component';
import { NgModule } from '@angular/core';
import { SobreSiteComponent } from './catalogo/sobre-site/sobre-site.component';

export const routes: Routes = [
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'catalogo/:id', component: DetalheFilmeComponent },
  { path: 'sobre', component: SobreSiteComponent } // Nova rota para "Sobre o Site"
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
