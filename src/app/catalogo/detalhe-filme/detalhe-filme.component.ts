import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmeService, Filme } from '../../shared/filme.service';
import { CommonModule, Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SafeUrlPipe } from '../../Links/safe-url.pipe';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-detalhe-filme',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, RouterLink],
  templateUrl: './detalhe-filme.component.html',
  styleUrls: ['./detalhe-filme.component.css'],
  styles: [`img { max-width: 300px; }`]
})
export class DetalheFilmeComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private filmeService = inject(FilmeService);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  filme$: Observable<Filme | undefined> = of();
  extraDetail: boolean = false;
  recommendationsVisible: boolean = false;
  recommendedMovies: Filme[] = [];
  viewCount: number = 0;
  theme: 'claro' | 'escuro' = 'claro'; // Estado inicial do tema

  ngOnInit(): void {
    this.filme$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.filmeService.buscarFilmePorId(Number(id));
      })
    );
    this.viewCount++;
    if (isPlatformBrowser(this.platformId)) {
      this.loadThemeFromLocalStorage(); // Carrega o tema salvo
      this.applyThemeToBody(); // Aplica o tema ao body
    }
  }

  ngOnDestroy(): void {
    // Limpeza de subscriptions, se necessário
  }

  // Carrega o tema do localStorage
  private loadThemeFromLocalStorage(): void {
    const savedTheme = localStorage.getItem('theme') as 'claro' | 'escuro';
    this.theme = savedTheme || 'claro'; // Usa 'claro' como padrão se não houver tema salvo
    console.log('Tema carregado no detalhe:', this.theme);
  }

  // Alterna o tema
  toggleTheme(): void {
    this.theme = this.theme === 'claro' ? 'escuro' : 'claro'; // Alterna entre claro e escuro
    console.log('Tema alterado no detalhe para:', this.theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.theme); // Salva o tema
      this.applyThemeToBody(); // Aplica a nova classe ao body
    }
    this.cdr.detectChanges(); // Força a atualização da view
  }

  // Aplica o tema ao body
  private applyThemeToBody(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.className = this.theme; // Define a classe do body como o tema atual
    }
  }

  voltar(): void {
    this.location.back();
  }

  curtirFilme(id: number | undefined): void {
    if (id !== undefined) {
      this.filmeService.curtirFilme(id).subscribe({
        next: (filmeAtualizado) => {
          console.log('Filme curtido:', filmeAtualizado);
          this.filme$ = of(filmeAtualizado);
        },
        error: (error) => console.error('Erro ao curtir filme:', error)
      });
    } else {
      console.error('ID do filme indefinido');
    }
  }

  toggleDetails(): void {
    console.log('Card clicado!');
  }

  onMouseEnter(): void {
  }

  onMouseLeave(): void {
  }

  showExtraDetail(): void {
    this.extraDetail = !this.extraDetail;
  }

  getViewCount(): number {
    return this.viewCount;
  }

  showRecommendations(): void {
    this.recommendationsVisible = !this.recommendationsVisible;
    if (this.recommendationsVisible) {
      this.filmeService.buscarFilmes().subscribe({
        next: (filmes: Filme[]) => {
          this.filme$.subscribe((filmeAtual: Filme | undefined) => {
            if (filmeAtual) {
              const filmesDisponiveis = filmes.filter(f => f.id !== filmeAtual.id);
              this.recommendedMovies = this.getRandomMovies(filmesDisponiveis, 3);
            }
          });
        },
        error: (error) => console.error('Erro ao buscar filmes para recomendações:', error)
      });
    } else {
      this.recommendedMovies = [];
    }
  }

  private getRandomMovies(filmes: Filme[], count: number): Filme[] {
    const shuffled = [...filmes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, filmes.length));
  }
}
