import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { MovieService } from '../../core/services/MoviesServices';
import { TVShow } from '../../interfaces/TVShow';
import { Genre } from '../../interfaces/Genre';
import { MovieItem } from "../../components/ui/movie-item/movie-item";

@Component({
  selector: 'app-tv-shows',
  imports: [MovieItem],
  templateUrl: './tv-shows.html',
  styleUrl: './tv-shows.css'
})
export class TvShows {
 @ViewChildren('cardsRow') cardsRows!: QueryList<ElementRef<HTMLDivElement>>;

  genreSections: { id: number, name: string, items: TVShow[] }[] = [];
  allTVShows: TVShow[] = [];
  allGenres: Genre[] = [];
  
  // Géneros que queremos mostrar (igual que en películas)
  selectedGenres = [
    'Action', 'Animation', 'Reality', '"Komödie',
    'Familie', 'Drama', 'Family', 'Fantasy', 'Mystery', 'Western', "War & Politics"
  ];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadGenresAndShows();
  }

  loadGenresAndShows(): void {
  this.movieService.getTVGenres().subscribe(genres => {
    this.allGenres = genres;

    const genresToShow = this.allGenres.filter(g =>
      this.selectedGenres.includes(g.name)
    );

    const genreRequests: Record<string, Observable<TVShow[]>> = {};
    genresToShow.forEach(genre => {
      genreRequests[genre.name] = this.movieService.getTVShowsByGenre(genre.id);
    });

    forkJoin(genreRequests).subscribe((results: Record<string, TVShow[]>) => {
      this.genreSections = genresToShow.map(genre => ({
        id: genre.id,
        name: genre.name,
        items: results[genre.name]?.slice(0, 20) || []
      }));
    });
  });
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