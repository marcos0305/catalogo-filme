import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Filme {
  id?: string;
  titulo: string;
  sinopse: string;
  elenco: string;
  diretor: string;
  duracao: string;
  classificacao: string;
  genero: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilmeService {
  private filmes: Filme[] = [];

  constructor() {
    this.filmes = [
      {
        id: '1',
        titulo: 'Filme 1',
        sinopse: 'Uma aventura épica...',
        elenco: 'Ator 1, Ator 2',
        diretor: 'Diretor 1',
        duracao: '120 min',
        classificacao: '12',
        genero: 'Ação',
        imageUrl: 'https://a.ltrbxd.com/resized/film-poster/1/1/1/6/6/0/0/1116600-sinners-2025-0-1000-0-1500-crop.jpg?v=00ce32e0ba'
      },
      {
        id: '2',
        titulo: 'Filme 2',
        sinopse: 'Uma comédia romântica...',
        elenco: 'Ator 3, Ator 4',
        diretor: 'Diretor 2',
        duracao: '90 min',
        classificacao: '14',
        genero: 'Comédia',
        imageUrl: 'https://a.ltrbxd.com/resized/film-poster/1/1/6/2/6/3/4/1162634-the-wedding-banquet-2025-0-1000-0-1500-crop.jpg?v=f6f4ead7d2'
      },
      {
        id: '2',
        titulo: 'Filme 2',
        sinopse: 'Uma comédia romântica...',
        elenco: 'Ator 3, Ator 4',
        diretor: 'Diretor 2',
        duracao: '90 min',
        classificacao: '14',
        genero: 'Drama',
        imageUrl: 'https://a.ltrbxd.com/resized/film-poster/1/1/1/6/6/0/0/1116600-sinners-2025-0-1000-0-1500-crop.jpg?v=00ce32e0ba'
      }
    ];
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const savedFilmes = localStorage.getItem('filmes');
    if (savedFilmes) {
      try {
        const parsedFilmes = JSON.parse(savedFilmes);
        if (Array.isArray(parsedFilmes)) {
          this.filmes = parsedFilmes.filter((filme: any) =>
            filme.titulo && filme.genero && filme.duracao
          );
        }
      } catch (error) {
        console.error('Erro ao carregar filmes do localStorage:', error);
      }
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('filmes', JSON.stringify(this.filmes));
    } catch (error) {
      console.error('Erro ao salvar filmes no localStorage:', error);
    }
  }

  getFilmes(): Observable<Filme[]> {
    return of(this.filmes);
  }

  searchFilmes(query: string): Observable<Filme[]> {
    if (!query.trim()) {
      return this.getFilmes();
    }
    const lowerQuery = query.toLowerCase();
    const filteredFilmes = this.filmes.filter(filme =>
      filme.titulo.toLowerCase().includes(lowerQuery) ||
      filme.genero.toLowerCase().includes(lowerQuery)
    );
    return of(filteredFilmes);
  }

  filterFilmes(genero: string, notaMinima: number): Observable<Filme[]> {
    let filteredFilmes = this.filmes;
    if (genero) {
      filteredFilmes = filteredFilmes.filter(filme =>
        filme.genero.toLowerCase() === genero.toLowerCase()
      );
    }
    return of(filteredFilmes);
  }

  searchFilmesWithFilter(query: string, genero: string): Observable<Filme[]> {
    let filteredFilmes = this.filmes;
    if (genero) {
      filteredFilmes = filteredFilmes.filter(filme =>
        filme.genero.toLowerCase() === genero.toLowerCase()
      );
    }
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filteredFilmes = filteredFilmes.filter(filme =>
        filme.titulo.toLowerCase().includes(lowerQuery) ||
        filme.genero.toLowerCase().includes(lowerQuery)
      );
    }
    return of(filteredFilmes);
  }
}
