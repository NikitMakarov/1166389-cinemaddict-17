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

const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic vF4sfS78wck9su2w';

export {FilterType, SortType, UserAction, UpdateType, END_POINT, AUTHORIZATION};
