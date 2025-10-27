import { Routes } from '@angular/router';
import { Movies } from './features/movies/movies';
import { Home } from './features/home/home';
import { Search } from './features/search/search';
import { DetailView } from './features/detail-view/detail-view';
import { TvShows } from './features/tv-shows/tv-shows';

export const routes: Routes = [
    {path:'', component:Home},
    {path: 'detail/:type/:id', component: DetailView },
    {path:'peliculas', component:Movies},
    {path:'series', component:TvShows},
    {path:'search', component:Search},

    {path:'', pathMatch:'full', redirectTo:'/'},
    {path:'**', redirectTo:'/'},
];
