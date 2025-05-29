import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmeService, Filme } from '../../shared/filme.service';
import { CommonModule, Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SafeUrlPipe } from '../../Links/safe-url.pipe';

@Component({
  selector: 'app-detalhe-filme',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe], // Corrigido para incluir SafeUrlPipe explicitamente
  templateUrl: './detalhe-filme.component.html', // Corrigido o caminho relativo
  styleUrls: ['./detalhe-filme.component.css'],
  styles: [`img { max-width: 300px; }`]
})
export class DetalheFilmeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private filmeService = inject(FilmeService);
  private location = inject(Location);

  filme$: Observable<Filme | undefined> = of();

  ngOnInit(): void {
    this.filme$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.filmeService.buscarFilmePorId(Number(id));
      })
    );
  }

  voltar(): void {
    this.location.back();
  }

  curtirFilme(id: number | undefined): void {
    if (id !== undefined) {
      this.filmeService.curtirFilme(id).pipe(
        tap((filmeAtualizado) => {
          console.log('Filme curtido:', filmeAtualizado);
          // Atualiza o Observable mantendo a reatividade
          this.filme$ = of(filmeAtualizado);
        })
      ).subscribe({
        error: (error) => console.error('Erro ao curtir filme:', error)
      });
    } else {
      console.error('ID do filme indefinido');
    }
  }
}
