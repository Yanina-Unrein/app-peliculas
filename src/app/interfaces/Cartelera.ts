import { Dates } from "./Dates";
import { Movie } from "./Movie";

export interface CarteleraResponse {
    dates:         Dates;
    page:          number;
    results:       Movie[];
    total_pages:   number;
    total_results: number;
}

