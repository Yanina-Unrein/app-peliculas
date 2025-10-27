import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-card',
  imports: [],
  templateUrl: './search-card.html',
  styleUrl: './search-card.css'
})
export class SearchCard {
  @Input() item: any;

  constructor(private router: Router) {}

  navigateToDetail(): void {
    if (!this.item) return;

    const itemType = this.item.media_type === 'tv' ? 'tv' : 'movie';
    this.router.navigate(['/detail', itemType, this.item.id]);
  }

  get displayTitle(): string {
    return this.item?.title || this.item?.name || '';
  }

  get posterPath(): string {
    if (this.item?.poster_path) {
      return `https://image.tmdb.org/t/p/w300${this.item.poster_path}`;
    }
    return '/assets/img/placeholder.webp';
  }

  get mediaType(): string {
    return this.item?.media_type === 'tv' ? 'Serie' : 'Película';
  }
}
