import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { TVShow } from '../../../interfaces/TVShow';
import { Movie } from '../../../interfaces/Movie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-item.html',
  styleUrl: './movie-item.css'
})
export class MovieItem {
  @Input() item?: Movie | TVShow; 
  @Input() type: 'upcoming' | 'top-rated' | 'genre' | 'default' = 'default' ;
  @Input() rank?: number;

  constructor(private router: Router) {}

  navigateToDetail(): void {
    if (!this.item) return;

    const itemType = this.isMovie(this.item) ? 'movie' : 'tv';
    this.router.navigate(['/detail', itemType, this.item.id]);
  }

  // Manejar click en la card
  @HostListener('click')
  onCardClick(): void {
    this.navigateToDetail();
  }

  // Manejar tecla Enter para accesibilidad
  @HostListener('keydown.enter')
  onEnterKey(): void {
    this.navigateToDetail();
  }

  // Type guard para verificar si es Movie
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

  if ('poster_path' in this.item && this.item.poster_path)
    return `https://image.tmdb.org/t/p/w500${this.item.poster_path}`;

  // Fallback a backdrop_path si poster_path no existe
  if ('backdrop_path' in this.item && this.item.backdrop_path)
    return `https://image.tmdb.org/t/p/w500${this.item.backdrop_path}`;

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

  // Descripción resumida
  get overview(): string {
    return this.item?.overview || '';
  }
}
