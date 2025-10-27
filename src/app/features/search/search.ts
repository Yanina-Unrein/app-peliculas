import { Component, signal } from '@angular/core';
import { SearchBar } from "../../components/ui/search-bar/search-bar";
import { MovieService } from '../../core/services/MoviesServices';
import { Router } from '@angular/router';
import { SearchCard } from "../../components/ui/search-card/search-card";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchBar, SearchCard],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search {
  results = signal<any[]>([]);
  realTimeResults = signal<any[]>([]);
  realTimeLoading = signal(false);
  loading = signal(false);
  error = signal('');
  lastSearchTerm = signal('');
  showTraditionalResults = signal(false);

  constructor(private movieService: MovieService) {}
  
  onRealTimeResults(results: any[]): void {
    this.realTimeResults.set(results);
    this.showTraditionalResults.set(false);
  }
  
  onRealTimeLoading(loading: boolean): void {
    this.realTimeLoading.set(loading);
  }
  
  // Método simplificado - recibe el string directamente
  onSearch(term: string): void {
    if (!term || !term.trim()) {
      this.clearAll();
      return;
    }

    this.lastSearchTerm.set(term);
    this.showTraditionalResults.set(true);
    this.realTimeResults.set([]);
    this.realTimeLoading.set(false);
    this.loading.set(true);
    this.error.set('');
    
    this.movieService.searchMoviesAndTV(term).subscribe({
      next: (data) => {
        this.results.set(data);
        if (data.length === 0) {
          this.error.set('No se encontraron resultados.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al buscar.');
        this.loading.set(false);
      }
    });
  }

  private clearAll(): void {
    this.results.set([]);
    this.realTimeResults.set([]);
    this.realTimeLoading.set(false);
    this.loading.set(false);
    this.error.set('');
    this.showTraditionalResults.set(false);
    this.lastSearchTerm.set('');
  }
}
