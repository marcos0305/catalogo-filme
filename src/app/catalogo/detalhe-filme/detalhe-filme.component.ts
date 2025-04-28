import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmeService, Filme } from '../../shared/filme.service';
import { CommonModule, Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-detalhe-filme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: '../detalhe-filme/detalhe-filme.component.html',
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

  voltar(): void{
    this.location.back();
  }
}
