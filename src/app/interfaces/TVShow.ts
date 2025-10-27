export interface TVShow {
  id: number;
  name: string;                    // título de la serie
  original_name: string;
  original_language?: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  last_air_date?: string;
  number_of_episodes: number;
  number_of_seasons: number;
  vote_average: number;
  vote_count: number;
  genres?: { id: number; name: string }[];    // opcional
  networks?: { id: number; name: string; logo_path: string | null; origin_country: string }[];
  type?: string; // Scripted, Reality, etc.
}
