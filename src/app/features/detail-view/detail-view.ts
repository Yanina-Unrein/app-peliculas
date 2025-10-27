import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Movie } from '../../interfaces/Movie';
import { TVShow } from '../../interfaces/TVShow';
import { Cast } from '../../interfaces/Cast';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../core/services/MoviesServices';

@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [],
  templateUrl: './detail-view.html',
  styleUrl: './detail-view.css'
})
export class DetailView implements OnInit {
  @ViewChild('castRow') castRow!: ElementRef<HTMLDivElement>;
  item: Movie | TVShow | null = null;
  images: { file_path: string }[] = [];
  cast: Cast[] = [];
  type: 'movie' | 'tv' = 'movie';
  loading: boolean = true;
  modalImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      const id = params.get('id');
      
      if (type && id) {
        this.type = type as 'movie' | 'tv';
        this.loadDetails(parseInt(id));
      }
    });
  }

  // Abrir modal
  openImageModal(filePath: string) {
    this.modalImage = filePath;
  }

  // Cerrar modal
  closeModal() {
    this.modalImage = null;
  }

  loadDetails(id: number): void {
    this.loading = true;
    
    this.movieService.getDetails(this.type, id).subscribe(details => {
      this.item = details as unknown as Movie | TVShow | null;
      this.loading = false;
    });

    // Cargar elenco
    this.movieService.getCredits(this.type, id).subscribe(cast => {
      this.cast = cast || [];
    });

    this.movieService.getImages(this.type, id).subscribe(res => {
      this.images = res.backdrops; 
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private isMovie(item: Movie | TVShow): item is Movie {
    return 'title' in item;
  }

  // Título a mostrar
  get displayTitle(): string {
    if (!this.item) return '';
    if ('title' in this.item) return this.item.title; // Movie
    if ('name' in this.item) return this.item.name;   // TVShow
    return '';
  }

  // Poster URL
  get posterPath(): string {
    if (!this.item) return '/assets/img/placeholder.webp';

    // Si el item tiene poster_path válido
    if ('poster_path' in this.item && this.item.poster_path) {
      return `https://image.tmdb.org/t/p/w500${this.item.poster_path}`;
    }

    // Si tiene backdrop_path (cuando no hay poster)
    if ('backdrop_path' in this.item && this.item.backdrop_path) {
      return `https://image.tmdb.org/t/p/w500${this.item.backdrop_path}`;
    }

    // Imagen por defecto
    return '/assets/img/placeholder.webp';
  }

  // Fecha de lanzamiento / primer capítulo
  get releaseDate(): string {
    if (!this.item) return '';
    if ('release_date' in this.item) return this.item.release_date; // Movie
    if ('first_air_date' in this.item) return this.item.first_air_date; // TVShow
    return '';
  }

  // Rating
  get voteAverage(): number {
    if (!this.item) return 0;
    return 'vote_average' in this.item ? this.item.vote_average : 0;
  }

  get genresList(): string {
    if (!this.item) return '';
    
    if (this.isMovie(this.item)) {
      // Para Movie, necesitaríamos mapear genre_ids a nombres
      // Por ahora retornamos vacío o podrías agregar un servicio para mapear IDs a nombres
      return '';
    } else {
      // Para TVShow, ya tenemos los nombres
      return this.item.genres ? this.item.genres.map(g => g.name).join(', ') : '';
    }
  }

  get hasGenres(): boolean {
    if (!this.item) return false;
    
    if (this.isMovie(this.item)) {
      return false; // O implementar mapeo de genre_ids si quieres
    } else {
      return !!this.item.genres && this.item.genres.length > 0;
    }
  }

    // Métodos para el slider del elenco
  scrollCastLeft(): void {
    if (this.castRow?.nativeElement) {
      const scrollAmount = this.castRow.nativeElement.clientWidth * 0.8;
      this.castRow.nativeElement.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  scrollCastRight(): void {
    if (this.castRow?.nativeElement) {
      const scrollAmount = this.castRow.nativeElement.clientWidth * 0.8;
      this.castRow.nativeElement.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}
