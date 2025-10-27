import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MovieService } from '../../../core/services/MoviesServices';
import { Movie } from '../../../interfaces/Movie';
import { MovieItem } from "../../ui/movie-item/movie-item";

@Component({
  selector: 'app-upcoming-container',
  standalone: true,
  imports: [MovieItem],
  templateUrl: './upcoming-container.html',
  styleUrl: './upcoming-container.css'
})
export class UpcomingContainer implements OnInit {
  @ViewChild('cardsRow') cardsRow!: ElementRef<HTMLDivElement>;
  upcomingMovies: Movie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getUpcomingMovies().subscribe({
      next: (res) => {
        this.upcomingMovies = res.results;
      },
      error: (err) => console.error(err)
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
