import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesByGenre } from './movies-by-genre';

describe('MoviesByGenre', () => {
  let component: MoviesByGenre;
  let fixture: ComponentFixture<MoviesByGenre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesByGenre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesByGenre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
