import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definir e exportar a interface Filme
export interface Filme {
imageUrl: any;
  id: number;
  titulo: string;
  sinopse: string;
  elenco: string;
  diretor: string;
  duracao: string;
  genero: string;
  classificacao: string;
  trailerUrl?: string;
  curtidas?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FilmeService {
  private apiUrl = 'http://localhost:8080/api/filmes';

  constructor(private http: HttpClient) {}

  buscarFilmes(): Observable<Filme[]> {
    return this.http.get<Filme[]>(this.apiUrl);
  }

  searchFilmes(query: string): Observable<Filme[]> {
    return this.http.get<Filme[]>(`${this.apiUrl}/search?query=${query}`);
  }

  filterFilmes(genero: string, classificacao: number): Observable<Filme[]> {
    return this.http.get<Filme[]>(`${this.apiUrl}/filter?genero=${genero}&classificacao=${classificacao}`);
  }

  searchFilmesWithFilter(query: string, genero: string): Observable<Filme[]> {
    return this.http.get<Filme[]>(`${this.apiUrl}/search?query=${query}&genero=${genero}`);
  }

  buscarFilmePorId(id: number): Observable<Filme | undefined> {
    return this.http.get<Filme>(`${this.apiUrl}/${id}`);
  }

  curtirFilme(id: number): Observable<Filme> {
    return this.http.post<Filme>(`${this.apiUrl}/${id}/curtir`, {});
  }
}
