import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilmeService ,Filme } from '../shared/filme.service';
import { Observable} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit, OnDestroy {
  filmes$: Observable<Filme[]>;
  query: string = '';
  genero: string = '';

  constructor(private readonly filmeService: FilmeService){
      this.filmes$ = this.filmeService.getFilmes();
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
    throw new Error('Method not implemented.');
  }

}
