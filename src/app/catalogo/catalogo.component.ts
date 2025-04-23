import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilmeService ,Filme } from '../shared/filme.service';
import { Observable} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit, OnDestroy {
  filmes$: Observable<Filme[]>;
  query: string = '';
  genero: string = '';

  constructor(private filmeService: FilmeService){
      this.filmes$ = filmeService.buscarFimes();
      this.filmes$.subscribe((f) => console.log(f))
    }

  ngOnInit(): void {}

  buscarFilmes(): void {
    if (this.query.trim()) {
      this.filmes$ = this.filmeService.searchFilmes(this.query);
    } else {
      this.filmes$ = this.filmeService.getFilmes();
    }
    this.filtrarFilmes();
  }

  filtrarFilmes(): void {
    this.filmes$ = this.filmeService.filterFilmes(this.genero, 0);
    if(this.query.trim()){
      this.filmes$ = this.filmeService.searchFilmesWithFilter(this.query, this.genero);
    }
  }

  ngOnDestroy(): void {

  }

}
