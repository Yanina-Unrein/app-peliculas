import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Movie } from '../../interfaces/Movie';
import { CarteleraResponse } from '../../interfaces/Cartelera';
import { MovieDetails } from '../../interfaces/MovieDetails';
import { Cast } from '../../interfaces/Cast';
import { Credits } from '../../interfaces/Credits';
import { TVShow } from '../../interfaces/TVShow';
import { Genre } from '../../interfaces/Genre';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private URL = '/api/tmdb';  
  private apiKey = environment.tmdbApiKey || ''; 
  private carteleraPage = 1;
  public cargando = false;

  constructor(private http: HttpClient) {}

  // Cartelera actual
  getCartelera(): Observable<Movie[]> {
    if (this.cargando) return of([]);

    this.cargando = true;
    return this.http.get<CarteleraResponse>(`${this.URL}/movie/now_playing?api_key=${this.apiKey}&language=es-ES&page=${this.carteleraPage}`)
      .pipe(
        map(res => res.results),
        tap(() => {
          this.carteleraPage += 1;
          this.cargando = false;
        })
      );
  }

  // Buscar películas
  buscarPeliculas(texto: string): Observable<Movie[]> {
    return this.http.get<CarteleraResponse>(`${this.URL}/search/movie?api_key=${this.apiKey}&query=${texto}&language=es-ES&page=1`)
      .pipe(map(res => res.results));
  }

  // Detalles de película
  peliculaDetalle(id: string): Observable<MovieDetails | null> {
    return this.http.get<MovieDetails>(`${this.URL}/movie/${id}?api_key=${this.apiKey}&language=es-ES`)
      .pipe(catchError(() => of(null)));
  }

  // Películas del 2025
  get2025Movies(): Observable<Movie[]> {
    return this.http
      .get<{ results: Movie[] }>(
        `${this.URL}/discover/movie?api_key=${this.apiKey}&language=es-ES&primary_release_year=2025&sort_by=popularity.desc&page=1`
      )
      .pipe(map(res => res.results));
  }

  // Series del 2025
  get2025TVShows(): Observable<TVShow[]> {
    return this.http
      .get<{ results: TVShow[] }>(
        `${this.URL}/discover/tv?api_key=${this.apiKey}&language=es-ES&first_air_date_year=2025&sort_by=popularity.desc&page=1`
      )
      .pipe(map(res => res.results));
  }

  // Créditos de película
  peliculaCreditos(id: string): Observable<Cast[] | null> {
    return this.http.get<Credits>(`${this.URL}/movie/${id}/credits?api_key=${this.apiKey}&language=es-ES`)
      .pipe(
        map(res => res.cast),
        catchError(() => of(null))
      );
  }

  // Resetear página de cartelera
  resetPeliculaPage() {
    this.carteleraPage = 1;
  }

  // Películas populares
  getPopularMovies(): Observable<Movie[]> {
    return this.http
      .get<CarteleraResponse>(`${this.URL}/movie/popular?api_key=${this.apiKey}&language=es-ES&page=1`)
      .pipe(map(res => res.results as Movie[]));
  }

  // Series populares
  getPopularTVShows(): Observable<TVShow[]> {
    return this.http.get<{ results: TVShow[] }>(
      `${this.URL}/tv/popular?api_key=${this.apiKey}&language=es-ES&page=1`
    ).pipe(
      map(res => res.results)
    );
  }

  // Detalles de película o serie
  getDetails(type: 'movie' | 'tv', id: number): Observable<MovieDetails | null> {
    return this.http.get<MovieDetails>(`${this.URL}/${type}/${id}?api_key=${this.apiKey}&language=es-ES`)
      .pipe(catchError(() => of(null)));
  }

  getUpcomingMovies(): Observable<{ results: Movie[] }> {
    return this.http.get<{ results: Movie[] }>(
      `${this.URL}/movie/upcoming?api_key=${this.apiKey}&language=es-ES&page=1`
    );
  }

  getTopRatedMovies(): Observable<Movie[]> {
    return this.http
      .get<{ results: Movie[] }>(
        `${this.URL}/discover/movie?api_key=${this.apiKey}&language=es-ES&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=2025&page=1`
      )
      .pipe(map(res => res.results));
  }

  getMoviesByGenre(genreId: number): Observable<Movie[]> {
    return this.http
      .get<{ results: Movie[] }>(
        `${this.URL}/discover/movie?api_key=${this.apiKey}&language=es-ES&with_genres=${genreId}&sort_by=popularity.desc&page=1`
      )
      .pipe(map(res => res.results));
  }

  getAnimeMovies(): Observable<Movie[]> {
  return this.http
    .get<{ results: Movie[] }>(
      `${this.URL}/discover/movie?api_key=${this.apiKey}&language=es-ES&with_keywords=210024&sort_by=popularity.desc&page=1`
    )
    .pipe(map(res => res.results));
  }

  getAnimeTVShows(): Observable<TVShow[]> {
    return this.http
      .get<{ results: TVShow[] }>(
        `${this.URL}/discover/tv?api_key=${this.apiKey}&language=es-ES&with_keywords=210024&sort_by=popularity.desc&page=1`
      )
      .pipe(map(res => res.results));
  }

  getKoreanContent(): Observable<(Movie | TVShow)[]> {
    return this.http.get<{ results: Movie[] }>(
      `${this.URL}/discover/movie?api_key=${this.apiKey}&language=es-ES&with_original_language=ko&sort_by=popularity.desc&page=1`
    ).pipe(
      map(res => res.results)
    );
  }

  getCredits(type: 'movie' | 'tv', id: number): Observable<Cast[]> {
    return this.http.get<Credits>(
      `${this.URL}/${type}/${id}/credits?api_key=${this.apiKey}&language=es-ES`
    ).pipe(
      map(res => res.cast.slice(0, 10)), // Solo primeros 10 actores
      catchError(() => of([]))
    );
  }

  getImages(type: 'movie' | 'tv', id: number): Observable<{ backdrops: any[], posters: any[] }> {
    return this.http.get<{ backdrops: any[], posters: any[] }>(
      `${this.URL}/${type}/${id}/images?api_key=${this.apiKey}`
    );
  }

  getMovieGenres() {
    return this.http.get< { genres: Genre[] } >( `${this.URL}/genre/movie/list?api_key=${this.apiKey}` )
      .pipe(map(res => res.genres));
  }

  getTVGenres(): Observable<Genre[]> {
    return this.http.get<{ genres: Genre[] }>(`${this.URL}/genre/tv/list?api_key=${this.apiKey}&language=es-ES`)
      .pipe(map(res => res.genres));
  }

  getTVShowsByGenre(genreId: number): Observable<TVShow[]> {
    return this.http.get<{ results: TVShow[] }>(
      `${this.URL}/discover/tv?api_key=${this.apiKey}&language=es-ES&with_genres=${genreId}&sort_by=popularity.desc&page=1`
    ).pipe(map(res => res.results));
  }

  searchMoviesAndTV(query: string): Observable<any> {
    if (!query.trim()) return of([]); // Evita llamadas vacías

    return this.http.get<{ results: any[] }>(
      `${this.URL}/search/multi?api_key=${this.apiKey}&language=es-ES&query=${query}&include_adult=false&page=1`
    ).pipe(
      map(res => res.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv')),
      catchError(() => of([]))
    );
  }
}
