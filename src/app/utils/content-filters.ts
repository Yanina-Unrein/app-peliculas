import { Movie } from '../interfaces/Movie';
import { TVShow } from '../interfaces/TVShow';

export function getKoreanContent(allMovies: Movie[], allTVShows: TVShow[]): (Movie | TVShow)[] {
  // SOLO películas con idioma coreano EXACTO
  const koreanMovies = allMovies.filter(movie => 
    movie.original_language === 'ko'
  );
  
  // SOLO series con idioma coreano EXACTO O network coreana
  const koreanTVShows = allTVShows.filter(tv => 
    tv.original_language === 'ko' || 
    tv.networks?.some(network => network.origin_country === 'KR')
  );

  return [...koreanMovies, ...koreanTVShows];
}

/**
 * Filtra contenido anime
 */
export function getAnimeContent(allMovies: Movie[], allTVShows: TVShow[]): (Movie | TVShow)[] {
  const animeMovies = allMovies.filter(m => 
    m.genre_ids?.includes(16) && m.original_language === 'ja'
  );
  
  const animeTVShows = allTVShows.filter(tv => 
    tv.genres?.some(g => g.id === 16) && tv.original_language === 'ja'
  );

  return [...animeMovies, ...animeTVShows];
}

/**
 * Filtra contenido por género
 */
export function getContentByGenre(
  allMovies: Movie[], 
  allTVShows: TVShow[], 
  genreId: number
): (Movie | TVShow)[] {
  const genreMovies = allMovies.filter(m => m.genre_ids?.includes(genreId));
  const genreTVShows = allTVShows.filter(tv => tv.genres?.some(g => g.id === genreId));

  return [...genreMovies, ...genreTVShows];
}

// Exportar como objeto para uso consistente
export const ContentFilters = {
  korean: getKoreanContent,
  anime: getAnimeContent,
  byGenre: getContentByGenre
};