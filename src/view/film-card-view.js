import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeDate, formatRuntime} from '../utils/task.js';

const BLANK_FILM = {
  title: 'Sagebrush Trail',
  alternativeTitle: 'An Innocent Man',
  totalRating: '7.8',
  poster: 'images/posters/sagebrush-trail.jpg',
  release: {
    date: '1933-12-15T00:00:00.000Z',
    releaseCountry: 'United States'
  },
  runtime: 54,
  genres: [
    'Western'
  ],
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.'
};

const createFilmCardTemplate = (film) => {
  const {title, totalRating, release, runtime, genres, poster, alternativeTitle, description, comments, isFavorite, isWatchList, isWatched, isDisabled} = film;
  const releaseDate = humanizeDate(release.date, 'YYYY');
  return (`
  <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${formatRuntime(runtime)}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="${poster}" alt="${alternativeTitle}" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${isWatchList ? 'film-card__controls-item--active' : ''} film-card__controls-item--add-to-watchlist" type="button" ${isDisabled ? 'disabled' : ''}>Add to watchlist</button>
      <button class="film-card__controls-item ${isWatched ? 'film-card__controls-item--active' : ''} film-card__controls-item--mark-as-watched" type="button" ${isDisabled ? 'disabled' : ''}>Mark as watched</button>
      <button class="film-card__controls-item ${isFavorite ? 'film-card__controls-item--active' : ''} film-card__controls-item--favorite" type="button" ${isDisabled ? 'disabled' : ''}>Mark as favorite</button>
    </div>
  </article>`
  );
};

export default class FilmCardView extends AbstractStatefulView {
  _state = null;

  constructor(film = BLANK_FILM) {
    super();
    this._state = FilmCardView.parseDataToState(film);
  }

  get template() {
    return createFilmCardTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setOpenPopUpClickHandler(this._callback.openPopUp);
  };

  setOpenPopUpClickHandler = (callback) => {
    this._callback.openPopUp = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openPopUpClickHandler);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchListClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #openPopUpClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.openPopUp(this._state);
  };

  #watchListClickHandler = () => {
    this._callback.watchListClick();
  };

  #watchedClickHandler = () => {
    this._callback.watchedClick();
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };

  _getUpdatingControls = () => this.element.querySelector('.film-card__controls');

  static parseDataToState = (film) => ({
    ...film,
    isDisabled: false,
  });
}
