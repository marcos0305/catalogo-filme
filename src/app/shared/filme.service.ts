import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable, of } from 'rxjs';

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
  getFilme(arg0: any) {
    throw new Error('Method not implemented.');
  }
  private filmes: Filme[] = [];
  private readonly API = 'api/filmes';

  constructor(private readonly httpClient: HttpClient) {
   this.buscarFimes().subscribe({
    next: (f) => this.filmes = f,
    error: (e) => console.error('Error ao buscar filmes:', e)
   })
  }

  buscarFimes(): Observable<Filme[]> {
    return this.httpClient.get<Filme[]> (this.API).pipe(
      first()
    );
  }

  buscarFilmePorId(id: number): Observable<Filme> {
    return this.httpClient.get<Filme> (`${this.API}/${id}`).pipe(
      first()
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

    if(genero){
      filteredFilmes = filteredFilmes.filter(filme => filme.genero.toLowerCase() === genero.toLowerCase());
    }

    return of(filteredFilmes);
  }
}
