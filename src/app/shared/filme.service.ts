import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Filme {
  id: number;
  titulo: string;
  sinopse: string;
  elenco: string;
  diretor: string;
  duracao: string;
  classificacao: string;
  genero: string;
  imageUrl?: string;
  trailerUrl: string;
  curtidas: number; }

@Injectable({
  providedIn: 'root'
})
export class FilmeService {
  buscarFilmes() {
    throw new Error('Method not implemented.');
  }
  private filmes: Filme[] = [];
  private readonly API = 'http://localhost:8080/api/filmes';

  constructor(private readonly httpClient: HttpClient) {
    this.carregarFilmes();
  }

  private carregarFilmes(): void {
    this.buscarFimes().subscribe({
      next: (f) => (this.filmes = f),
      error: (e) => console.error('Erro ao carregar filmes:', e)
    });
  }

  buscarFimes(): Observable<Filme[]> {
    console.log('Chamando buscarFimes');
    return this.httpClient.get<Filme[]>(this.API).pipe(
        tap(filmes => console.log('Filmes recebidos:', filmes)),
        catchError(error => {
            console.error('Erro ao buscar filmes:', error);
            return of([]);
        })
    );
}

  buscarFilmePorId(id: number): Observable<Filme> {
    return this.httpClient.get<Filme>(`${this.API}/${id}`).pipe(
      catchError(error => {
        console.error('Erro ao buscar filme por ID:', error);
        return of({} as Filme);
      })
    );
  }

  curtirFilme(id: number): Observable<Filme> {
    return this.httpClient.post<Filme>(`${this.API}/${id}/curtir`, {}).pipe(
      tap(filmeAtualizado => {
        const index = this.filmes.findIndex(f => f.id === id);
        if (index !== -1) {
          this.filmes[index] = filmeAtualizado;
        }
      }),
      catchError(error => {
        console.error('Erro ao curtir filme:', error);
        return of({} as Filme);
      })
    );
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
