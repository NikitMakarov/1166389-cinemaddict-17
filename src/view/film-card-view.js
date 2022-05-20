import AbstractView from '../framework/view/abstract-view.js';
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
  const {title, totalRating, release, runtime, genres, poster, alternativeTitle, description} = film;

  const releaseDate = humanizeDate(release.date, 'YYYY');
  return (`
  <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${formatRuntime(runtime)}</span>
        <span class="film-card__genre">${genres}</span>
      </p>
      <img src="${poster}" alt="${alternativeTitle}" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">5 comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`
  );
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film = BLANK_FILM) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setOpenPopUpClickHandler = (callback) => {
    this._callback.openPopUp = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openPopUpClickHandler);
  };

  #openPopUpClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.openPopUp();
  };
}
