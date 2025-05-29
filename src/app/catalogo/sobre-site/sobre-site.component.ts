import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sobre-site',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre-site.component.html',
  styleUrls: ['./sobre-site.component.css']
})
export class SobreSiteComponent {
  private location = inject(Location);

  voltar(): void {
    this.location.back();
  }
}
