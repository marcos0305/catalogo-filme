import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID, HostListener } from '@angular/core';
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
  theme: 'claro'| 'escuro' = 'claro';

  constructor(
  private filmeService: FilmeService,
  private cdr: ChangeDetectorRef,
  @Inject(PLATFORM_ID) private platformId: Object
) {
  this.sortCriteria = 'recentes';
  if (isPlatformBrowser(this.platformId)) {
    this.loadSortCriteriaFromLocalStorage();
    this.loadThemeFromLocalStorage();
  }
}

  ngOnInit(): void {
    this.carregarFilmes();
  }

  // Método para carregar o tema do localStorage
  private loadThemeFromLocalStorage(): void {
    const savedTheme = localStorage.getItem('theme') as 'claro' | 'escuro';
    this.theme = savedTheme || 'claro';
    console.log('Tema carregado do localStorage:', this.theme);
  }

  // Método para alternar o tema
  toggleTheme(): void {
    this.theme = this.theme === 'claro' ? 'escuro' : 'claro';
    console.log('Tema alterado para:', this.theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.theme);
      document.body.className = this.theme;
    }
    this.cdr.detectChanges(); // Força a atualização da view
  }



  private loadSortCriteriaFromLocalStorage(): void {
  const savedCriteria = localStorage.getItem('sortCriteria') as 'titulo' | 'curtidas' | 'recentes';
  this.sortCriteria = savedCriteria || 'recentes';
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

@HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const backToTopButton = document.querySelector('.back-to-top') as HTMLElement;
      if (window.pageYOffset > 300) { // Aparece após rolar 300px
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    }
  }

  // Volta ao topo
  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
