import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { FilmeService, Filme } from '../shared/filme.service';
import { map, Observable, of, Subscription, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  filmes$: Observable<Filme[]> | undefined;
  query: string = '';
  genero: string = '';
  subscription = new Subscription();
  sortCriteria: 'titulo' | 'curtidas'| 'recentes' = 'titulo';
  private isLoading = false;

  constructor(
  private filmeService: FilmeService,
  private cdr: ChangeDetectorRef,
  @Inject(PLATFORM_ID) private platformId: Object
) {
  this.sortCriteria = 'recentes';
  if (isPlatformBrowser(this.platformId)) {
    this.loadSortCriteriaFromLocalStorage();
  }
}

private loadSortCriteriaFromLocalStorage(): void {
  const savedCriteria = localStorage.getItem('sortCriteria') as 'titulo' | 'curtidas' | 'recentes';
  this.sortCriteria = savedCriteria || 'recentes';
}

  ngOnInit(): void {
    this.carregarFilmes();
  }

  carregarFilmes(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    console.log('Iniciando carregamento de filmes...');
    this.filmes$ = this.filmeService.buscarFilmes().pipe(
      tap(filmes => console.log('Filmes carregados:', filmes)),
      map(filmes => this.filtrarESortearFilmes(filmes)),
      tap(() => this.isLoading = false)
    );
  }

  buscarFilmes(): void {
    if (this.isLoading) return;
    if (this.query.trim()) {
      this.filmes$ = this.filmeService.searchFilmes(this.query).pipe(
        map(filmes => this.filtrarESortearFilmes(filmes))
      );
    } else {
      this.carregarFilmes();
    }
  }

  filtrarFilmes(): void {
  if (this.isLoading) return
  if (this.query.trim()) {
    this.filmes$ = this.filmeService.searchFilmesWithFilter(this.query, this.genero).pipe(
      map(filmes => this.filtrarESortearFilmes(filmes))
    );
  } else {
    this.filmes$ = this.filmeService.filterFilmes(this.genero, 0).pipe(
      map(filmes => this.filtrarESortearFilmes(filmes))
    );
  }
}

  filtrarESortearFilmes(filmes: Filme[]): Filme[] {
    let resultado = [...filmes];
    if (this.genero) {
      resultado = resultado.filter(filme => filme.genero === this.genero);
    }
    return this.sortFilmes(resultado);
  }

  sortFilmes(filmes: Filme[]): Filme[] {
  return [...filmes].sort((a, b) => {
    if (this.sortCriteria === 'titulo') {
      return a.titulo.localeCompare(b.titulo);
    } else if (this.sortCriteria === 'curtidas') {
      return (b.curtidas || 0) - (a.curtidas || 0);
    } else if (this.sortCriteria === 'recentes') {
      const anoA = a.dataLancamento ? parseInt(a.dataLancamento.slice(0, 4)) : 0;
      const anoB = b.dataLancamento ? parseInt(b.dataLancamento.slice(0, 4)) : 0;
      return anoB - anoA;
    }
    return 0;
  });
}

 setSortCriteria(criteria: 'titulo' | 'curtidas' | 'recentes'): void {
  console.log('Ordenação alterada para:', criteria);
  this.sortCriteria = criteria;
  if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('sortCriteria', criteria);
  }
  this.carregarFilmes();
}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
