const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'watched',
  FAVORITES: 'favorites'
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
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

const TimeLimit = {
  LOWER_LIMIT: 450,
  UPPER_LIMIT: 1000
};

const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic vF4sfS78wck9su2w';
const SHAKE_CLASS_NAME = 'shake';
const SHAKE_ANIMATION_TIMEOUT = 600;
const FILM_COUNT_PER_STEP = 5;


export {FilterType, SortType, UserAction, UpdateType, END_POINT, AUTHORIZATION, SHAKE_CLASS_NAME, SHAKE_ANIMATION_TIMEOUT, FILM_COUNT_PER_STEP, TimeLimit};
