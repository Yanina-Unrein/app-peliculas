import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Movie } from '../../../interfaces/Movie';
import { TVShow } from '../../../interfaces/TVShow';
import { Genre } from '../../../interfaces/Genre';
import { MovieService } from '../../../core/services/MoviesServices';
import { MovieItem } from "../../ui/movie-item/movie-item";
import { ContentFilters } from '../../../utils/content-filters';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-movies-by-genre',
  standalone: true,
  imports: [MovieItem],
  templateUrl: './movies-by-genre.html',
  styleUrl: './movies-by-genre.css'
})
export class MoviesByGenre implements OnInit {
  @ViewChildren('cardsRow') cardsRows!: QueryList<ElementRef<HTMLDivElement>>;
  
  genreSections: Genre[] = [];
  allMovies: Movie[] = [];
  allTVShows: TVShow[] = [];

  // Géneros a mostrar
  genresToShow = [
    { 
      id: 27, 
      name: 'Terror', 
      type: 'genre'
    },
    { 
      id: 10749, 
      name: 'Romance', 
      type: 'genre'
    },
    { 
      id: 16, 
      name: 'Anime', 
      type: 'anime'
    },
    { 
      id: 0, 
      name: 'Coreanas', 
      type: 'country'
    }
  ];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadAllContent();
  }

  loadAllContent() {
    // Cargar todo simultáneamente con forkJoin
    const requests = {
      terror: this.movieService.getMoviesByGenre(27),
      romance: this.movieService.getMoviesByGenre(10749),
      tvShows: this.movieService.getPopularTVShows(),
      animeMovies: this.movieService.getAnimeMovies(),
      animeTVShows: this.movieService.getAnimeTVShows(),
      // AGREGAR contenido coreano específico
      koreanContent: this.movieService.getKoreanContent().pipe(
        // Si no existe el método, puedes usar un fallback
        // catchError(() => of([]))
      )
    };

    forkJoin(requests).subscribe({
      next: (results) => {
        // Limpiar arrays
        this.allMovies = [];
        this.allTVShows = [];

        // Cargar películas
        this.allMovies.push(
          ...results.terror,
          ...results.romance,
          ...results.animeMovies
        );

        // Cargar series
        this.allTVShows.push(
          ...results.tvShows,
          ...results.animeTVShows
        );

        // Procesar contenido coreano si existe
        if (results.koreanContent) {
          results.koreanContent.forEach(item => {
            if ('title' in item) {
              this.allMovies.push(item as Movie);
            } else if ('name' in item) {
              this.allTVShows.push(item as TVShow);
            }
          });
        }

        this.removeDuplicates();
        this.buildSections();
      },
      error: (error) => {
        console.error('Error loading content:', error);
      }
    });
  }

  private removeDuplicates(): void {
    // Eliminar duplicados en allMovies
    const uniqueMoviesMap = new Map();
    this.allMovies.forEach(movie => {
      if (!uniqueMoviesMap.has(movie.id)) {
        uniqueMoviesMap.set(movie.id, movie);
      }
    });
    this.allMovies = Array.from(uniqueMoviesMap.values());

    // Eliminar duplicados en allTVShows
    const uniqueTVShowsMap = new Map();
    this.allTVShows.forEach(tv => {
      if (!uniqueTVShowsMap.has(tv.id)) {
        uniqueTVShowsMap.set(tv.id, tv);
      }
    });
    this.allTVShows = Array.from(uniqueTVShowsMap.values());
  }

   buildSections() {  
    this.genreSections = this.genresToShow
      .map(genre => {
        const items: (Movie | TVShow)[] = [];
        
        switch (genre.name.toLowerCase()) {
          case 'terror':
            items.push(...ContentFilters.byGenre(this.allMovies, this.allTVShows, 27));
            break;

          case 'romance':
            items.push(...ContentFilters.byGenre(this.allMovies, this.allTVShows, 10749));
            break;

          case 'anime':
            items.push(...ContentFilters.anime(this.allMovies, this.allTVShows));
            break;

          case 'coreanas':
            items.push(...ContentFilters.korean(this.allMovies, this.allTVShows));
            break;
        }      
        
        return {
          id: genre.id,
          name: genre.name,
          items: items.slice(0, 20)
        };
      })
      .filter(section => section.items.length > 0);
  }


  scrollLeft(sectionIndex: number) {
    const cardsRowsArray = this.cardsRows.toArray();
    if (cardsRowsArray[sectionIndex]?.nativeElement) {
      const scrollAmount = cardsRowsArray[sectionIndex].nativeElement.clientWidth * 0.8;
      cardsRowsArray[sectionIndex].nativeElement.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  scrollRight(sectionIndex: number) {
    const cardsRowsArray = this.cardsRows.toArray();
    if (cardsRowsArray[sectionIndex]?.nativeElement) {
      const scrollAmount = cardsRowsArray[sectionIndex].nativeElement.clientWidth * 0.8;
      cardsRowsArray[sectionIndex].nativeElement.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}
