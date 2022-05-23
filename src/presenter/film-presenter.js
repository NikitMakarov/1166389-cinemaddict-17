import PopUpView from '../view/popup-view.js';
import FilmCardView from '../view/film-card-view.js';

import {render, replace, remove} from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmPresenter {
  #filmContainer = null;
  #changeData = null;
  #changeMode = null;

  #film = null;
  #mode = Mode.DEFAULT;

  #siteBody = null;
  #filteredComments = null;
  #filmComponent = null;
  #popUpComponent = null;

  #filmsComments = null;

  constructor(filmContainer, filmsComments, changeData, changeMode) {
    this.#filmContainer = filmContainer;
    this.#filmsComments = filmsComments;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopUpComponent = this.#popUpComponent;

    this.#siteBody = document.querySelector('body');
    this.#filteredComments = this.#filmsComments.filter((comment) => film.comments.includes(comment.filmId));
    this.#filmComponent = new FilmCardView(film);
    this.#popUpComponent = new PopUpView(film, this.#filteredComments);

    this.#filmComponent.setOpenPopUpClickHandler(this.#setOpenPopUpClickHandler);
    this.#filmComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popUpComponent.setClosePopUpClickHandler(this.#setClosePopUpClickHandler);
    this.#popUpComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#popUpComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popUpComponent.setFavoriteClickHandler(this.#handleFavoriteClick);


    if (prevFilmComponent === null || prevPopUpComponent === null) {
      render(this.#filmComponent, this.#filmContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
      remove(prevFilmComponent);
    }

    if (this.#mode === Mode.POPUP) {
      replace(this.#popUpComponent, prevPopUpComponent);
      remove(prevPopUpComponent);
    }
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#popUpComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#removePopUp();
    }
  };

  #createPopUp = () => {
    this.#siteBody.appendChild(this.#popUpComponent.element);
    this.#siteBody.classList.add('hide-overflow');

    this.#changeMode();
    this.#mode = Mode.POPUP;
  };

  #removePopUp = () => {
    this.#siteBody.removeChild(this.#popUpComponent.element);
    this.#siteBody.classList.remove('hide-overflow');

    this.#mode = Mode.DEFAULT;
  };

  #handleWatchListClick = () => {
    this.#changeData({...this.#film, isWatchList: !this.#film.isWatchList});
  };

  #handleWatchedClick = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  };

  #setOpenPopUpClickHandler = (film) => {
    this.#changeData(film);
    this.#createPopUp();
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #setClosePopUpClickHandler = () => {
    this.#removePopUp();
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      document.removeEventListener('keydown', this.#onEscKeyDown);
      this.#removePopUp();
    }
  };
}
