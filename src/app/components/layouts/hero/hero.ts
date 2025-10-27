import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MovieService } from '../../../core/services/MoviesServices';
import { Movie } from '../../../interfaces/Movie';
import { TVShow } from '../../../interfaces/TVShow';
import { Router } from '@angular/router';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero implements OnInit, OnDestroy {
  featuredItem: Movie | TVShow | null = null;
  type: 'movie' | 'tv' = 'movie';
  showMovie: boolean = true;
  private intervalId: any;

  get itemTitle(): string {
    if (!this.featuredItem) return '';
    // Type guard
    if ('title' in this.featuredItem) {
      return this.featuredItem.title; // es Movie
    } else {
      return this.featuredItem.name;  // es TVShow
    }
  }

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.loadFeatured2025();

    this.intervalId = setInterval(() => {
      this.fadeOutThenChange();
    }, 20000);
  }

  fadeOutThenChange(): void {
    this.showMovie = false;

    setTimeout(() => {
      this.loadFeatured2025();
      this.showMovie = true;
    }, 800);
  }

   loadFeatured2025(): void {
    const randomType = Math.random() < 0.5 ? 'movie' : 'tv';
    this.type = randomType;

    if (randomType === 'movie') {
      // Usar películas del 2025 en lugar de populares
      this.movieService.get2025Movies().subscribe((movies: Movie[]) => {
        if (movies.length > 0) {
          this.featuredItem = movies[Math.floor(Math.random() * movies.length)];
        } else {
          // Fallback a películas populares si no hay del 2025
          this.movieService.getPopularMovies().subscribe(popularMovies => {
            this.featuredItem = popularMovies[Math.floor(Math.random() * popularMovies.length)];
          });
        }
      });
    } else {
      // Usar series del 2025 en lugar de populares
      this.movieService.get2025TVShows().subscribe((shows: TVShow[]) => {
        if (shows.length > 0) {
          this.featuredItem = shows[Math.floor(Math.random() * shows.length)];
        } else {
          // Fallback a series populares si no hay del 2025
          this.movieService.getPopularTVShows().subscribe(popularShows => {
            this.featuredItem = popularShows[Math.floor(Math.random() * popularShows.length)];
          });
        }
      });
    }
  }

  loadFeatured(): void {
    const randomType = Math.random() < 0.5 ? 'movie' : 'tv';
    this.type = randomType;

    if (randomType === 'movie') {
      this.movieService.getPopularMovies().subscribe((movies: Movie[]) => {
        this.featuredItem = movies[Math.floor(Math.random() * movies.length)];
      });
    } else {
      this.movieService.getPopularTVShows().subscribe((shows: TVShow[]) => {
        this.featuredItem = shows[Math.floor(Math.random() * shows.length)];
      });
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  goToDetail(): void {
    if (!this.featuredItem) return;

    const id = 'id' in this.featuredItem ? this.featuredItem.id : 0;
    this.router.navigate(['/detail', this.type, id]);
  }
}
