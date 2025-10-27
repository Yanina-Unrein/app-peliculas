import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MovieService } from '../../core/services/MoviesServices';
import { Movie } from '../../interfaces/Movie';
import { forkJoin } from 'rxjs';
import { MovieItem } from "../../components/ui/movie-item/movie-item";

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [MovieItem],
  templateUrl: './movies.html',
  styleUrl: './movies.css'
})
export class Movies implements OnInit {
  @ViewChildren('cardsRow') cardsRows!: QueryList<ElementRef<HTMLDivElement>>;

  selectedGenres: string[] = [
    'Action',
    'Adventure',
    'Horror',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Thriller',
    'Animation'
  ];

  genreSections: { id: number, name: string, items: Movie[] }[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadGenresAndMovies();
  }

  loadGenresAndMovies() {
    this.movieService.getMovieGenres().subscribe((allGenres: {id:number,name:string}[]) => {
      // Usamos la propiedad de clase selectedGenres
      const genresToShow = allGenres.filter(g => this.selectedGenres.includes(g.name));

      const genreRequests: any = {};
      genresToShow.forEach(genre => {
        genreRequests[genre.name] = this.movieService.getMoviesByGenre(genre.id);
      });

      forkJoin(genreRequests).subscribe((results: any) => {
        this.genreSections = genresToShow.map((genre) => ({
          id: genre.id,
          name: genre.name,
          items: results[genre.name].slice(0, 20)
        }));
      });
    });
  }

  scrollLeft(index: number) {
    const row = this.cardsRows.toArray()[index]?.nativeElement;
    if (row) row.scrollBy({ left: -row.clientWidth * 0.8, behavior: 'smooth' });
  }

  scrollRight(index: number) {
    const row = this.cardsRows.toArray()[index]?.nativeElement;
    if (row) row.scrollBy({ left: row.clientWidth * 0.8, behavior: 'smooth' });
  }
}
