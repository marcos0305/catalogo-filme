import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmeService, Filme } from '../../shared/filme.service';
import { CommonModule, Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SafeUrlPipe } from '../../Links/safe-url.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalhe-filme',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, RouterLink],
  templateUrl: './detalhe-filme.component.html',
  styleUrls: ['./detalhe-filme.component.css'],
  styles: [`img { max-width: 300px; }`]
})
export class DetalheFilmeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private filmeService = inject(FilmeService);
  private location = inject(Location);

  filme$: Observable<Filme | undefined> = of();
  extraDetail: boolean = false;
  recommendationsVisible: boolean = false;
  recommendedMovies: Filme[] = []; // Armazena os filmes recomendados
  viewCount: number = 0;
  quotes: string[] = [
    "Vida é uma cabaré, meu caro!",
    "Às vezes, o medo é o melhor amigo que você pode ter.",
    "Ria, ou a escuridão te engolirá!"
  ];

  ngOnInit(): void {
    this.filme$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.filmeService.buscarFilmePorId(Number(id));
      })
    );
    this.viewCount++; // Incrementa visualizações ao carregar
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
    // Você pode adicionar lógica aqui se desejar
  }

  onMouseEnter(): void {
    // Animação ao passar o mouse (estilizada no CSS)
  }

  onMouseLeave(): void {
    // Reseta animação ao sair
  }

  showExtraDetail(): void {
    this.extraDetail = !this.extraDetail;
  }

  getRandomQuote(): string {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }

  getViewCount(): number {
    return this.viewCount;
  }

  showRecommendations(): void {
    this.recommendationsVisible = !this.recommendationsVisible;
    if (this.recommendationsVisible) {
      // Corrigido: buscarFimes -> buscarFilmes
      this.filmeService.buscarFilmes().subscribe({
        next: (filmes: Filme[]) => { // Adicionado tipo explícito Filme[]
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
    const shuffled = [...filmes].sort(() => 0.5 - Math.random()); // Embaralha a lista
    return shuffled.slice(0, Math.min(count, filmes.length)); // Retorna até 'count' filmes
  }
}
