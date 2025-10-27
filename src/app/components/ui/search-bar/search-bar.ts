import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';
import { MovieService } from '../../../core/services/MoviesServices';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar   implements AfterViewInit {
  @Output() search = new EventEmitter<string>();
  @Output() realTimeResults = new EventEmitter<any[]>();
  @Output() realTimeLoading = new EventEmitter<boolean>();
  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;
  
  searchTerm = '';
  
  private searchSubject = new Subject<string>();

  constructor(private movieService: MovieService) {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.realTimeLoading.emit(true)),
      switchMap(term => {
        return this.movieService.searchMoviesAndTV(term).pipe(
          tap(() => this.realTimeLoading.emit(false))
        );
      })
    ).subscribe({
      next: (results) => {
        this.realTimeResults.emit(results);
      },
      error: () => {
        this.realTimeResults.emit([]);
        this.realTimeLoading.emit(false);
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.txtBuscar.nativeElement.focus();
    }, 100);
  }

  onInputChange(event: any): void {
    this.searchTerm = event.target.value;
    
    if (this.searchTerm.length > 2) {
      this.searchSubject.next(this.searchTerm);
    } else {
      this.realTimeResults.emit([]);
      this.realTimeLoading.emit(false);
    }
  }

  // Método corregido - obtener el valor directamente del input
  onSearch(): void {
    const term = this.txtBuscar.nativeElement.value;
    const trimmed = term.trim();
    
    if (trimmed) {
      this.realTimeResults.emit([]);
      this.realTimeLoading.emit(false);
      this.search.emit(trimmed);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.realTimeResults.emit([]);
    this.realTimeLoading.emit(false);
    this.txtBuscar.nativeElement.value = '';
    this.search.emit('');
  }

  // Método para cuando se presiona Enter en el input
  onEnterKey(): void {
    this.onSearch();
  }
}
