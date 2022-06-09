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
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  SHOWPOPUP: 'SHOWPOPUP',
  SHOWFILMLIST: 'SHOWFILMLIST',
  SHOWBOARD: 'SHOWBOARD',
};

export {FilterType, SortType, UserAction, UpdateType};
