import {FilterType} from '../const';

const filter = {
  [FilterType.ALL]: (films) => [...films],
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchList),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};

const capitalizeName = (name) => name.charAt(0).toUpperCase() + name.slice(1);

export {filter, capitalizeName};
