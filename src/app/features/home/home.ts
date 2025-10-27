import { Component, HostListener, OnInit } from '@angular/core';
import { MovieService } from '../../core/services/MoviesServices';
import { Movie } from '../../interfaces/Movie';
import { Hero } from "../../components/layouts/hero/hero";
import { UpcomingContainer } from "../../components/layouts/upcoming-container/upcoming-container";
import { TopRated } from "../../components/layouts/top-rated/top-rated";
import { MoviesByGenre } from "../../components/layouts/movies-by-genre/movies-by-genre";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, UpcomingContainer, TopRated, MoviesByGenre],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  movies:Movie[]=[];
  loadedMoviesIds = new Set<number>();



  constructor(private peliculasSvc:MovieService){
    this.peliculasSvc.resetPeliculaPage();
  }

  ngOnInit(): void {
    this.loadMovies(); 
  }


  loadMovies(){
    this.peliculasSvc.getCartelera().subscribe(res=>{
      this.movies = res;
      this.updateLoadedMovieIds();
    })
  }

  loadMoreMovies(){
    this.peliculasSvc.getCartelera().subscribe(res=>{
      const newMovies = res.filter(movie=>!this.loadedMoviesIds.has(movie.id));
      this.movies.push(...newMovies);
      this.updateLoadedMovieIds();
    })
  }

  updateLoadedMovieIds(){
    this.movies.forEach(movie=>this.loadedMoviesIds.add(movie.id));
  }
}
