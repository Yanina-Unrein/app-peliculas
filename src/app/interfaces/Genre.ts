import { Movie } from "./Movie";
import { TVShow } from "./TVShow";

export interface Genre {
    id:   number;
    name: string;
    items?: (Movie | TVShow)[]
}