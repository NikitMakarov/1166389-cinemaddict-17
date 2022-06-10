const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'watched',
  FAVORITES: 'favorites'
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  UPDATE_FILM: 'UPDATE_FILM',
  DELETE_COMMENT: 'DELETE_COMMENT'
};

const UpdateType = {
  SHOW_POPUP: 'SHOW_POPUP',
  SHOW_FILM_LIST: 'SHOW_FILM_LIST',
  SHOW_BOARD: 'SHOW_BOARD',
  INIT_DATA: 'INIT_DATA'
};

export {FilterType, SortType, UserAction, UpdateType};
