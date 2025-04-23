import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheFilmeComponent } from './detalhe-filme.component';

describe('DetalheFilmeComponent', () => {
  let component: DetalheFilmeComponent;
  let fixture: ComponentFixture<DetalheFilmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheFilmeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalheFilmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
