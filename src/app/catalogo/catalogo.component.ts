import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilmeService, Filme } from '../shared/filme.service';
import { map, Observable, of, Subscription, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule, RouterLink],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit, OnDestroy {
  menuAberto: any;
  filmes$: Observable<Filme[]>;
  query: string = '';
  genero: string = '';
  subscription = new Subscription();
  sortCriteria: 'titulo' | 'curtidas' = 'titulo';

  constructor(private filmeService: FilmeService) {
    this.sortCriteria = (localStorage.getItem('sortCriteria') as 'titulo' | 'curtidas') || 'titulo';
    this.filmes$ = of([]);
  }

  ngOnInit(): void {
    this.carregarFilmes();
  }

  carregarFilmes(): void {
    this.filmes$ = this.filmeService.buscarFimes().pipe(
      tap(filmes => console.log('Filmes carregados:', filmes)),
      map(filmes => this.sortFilmes(filmes))
    );
  }

  buscarFilmes(): void {
    if (this.query.trim()) {
      this.filmes$ = this.filmeService.searchFilmes(this.query).pipe(
        map(filmes => this.sortFilmes(filmes))
      );
    } else {
      this.filmes$ = this.filmeService.getFilmes().pipe(
        map(filmes => this.sortFilmes(filmes))
      );
    }
    this.filtrarFilmes();
  }

  filtrarFilmes(): void {
    this.filmes$ = this.filmeService.filterFilmes(this.genero, 0).pipe(
      map(filmes => this.sortFilmes(filmes))
    );
    if (this.query.trim()) {
      this.filmes$ = this.filmeService.searchFilmesWithFilter(this.query, this.genero).pipe(
        map(filmes => this.sortFilmes(filmes))
      );
    }
  }

  sortFilmes(filmes: Filme[]): Filme[] {
    return [...filmes].sort((a, b) => {
      if (this.sortCriteria === 'titulo') {
        return a.titulo.localeCompare(b.titulo);
      } else if (this.sortCriteria === 'curtidas') {
        return (b.curtidas || 0) - (a.curtidas || 0);
      }
      return 0;
    });
  }

  setSortCriteria(criteria: 'titulo' | 'curtidas'): void {
    this.sortCriteria = criteria;
    localStorage.setItem('sortCriteria', criteria);
    this.carregarFilmes();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
