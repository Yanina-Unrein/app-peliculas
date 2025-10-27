import { Component, ElementRef, ViewChild } from '@angular/core';
import { Movie } from '../../../interfaces/Movie';
import { MovieService } from '../../../core/services/MoviesServices';
import { MovieItem } from "../../ui/movie-item/movie-item";

@Component({
  selector: 'app-top-rated',
  standalone: true,
  imports: [MovieItem],
  templateUrl: './top-rated.html',
  styleUrl: './top-rated.css'
})
export class TopRated {
  @ViewChild('cardsRow') cardsRow!: ElementRef<HTMLDivElement>;
  topMovies: Movie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getTopRatedMovies().subscribe((movies) => {
      this.topMovies = movies.slice(0, 10);
    });
  }

  scrollLeft() {
    if (this.cardsRow?.nativeElement) {
      const scrollAmount = this.cardsRow.nativeElement.clientWidth * 0.8;
      this.cardsRow.nativeElement.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  scrollRight() {
    if (this.cardsRow?.nativeElement) {
      const scrollAmount = this.cardsRow.nativeElement.clientWidth * 0.8;
      this.cardsRow.nativeElement.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}
