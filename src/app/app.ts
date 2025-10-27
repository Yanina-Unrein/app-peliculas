import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/layouts/header/header';
import { Footer } from "./components/layouts/footer/footer";
import { ScrollToTop } from "./components/ui/scroll-to-top/scroll-to-top";
import { Loading } from "./components/ui/loading/loading";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ScrollToTop, Loading],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}
