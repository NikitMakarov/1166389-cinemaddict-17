import PopUpView from '../view/popup-view.js';
import FilmCardView from '../view/film-card-view.js';

import {render} from '../framework/render.js';

export default class FilmPresenter {
  #filmContainer = null;

  #film = null;

  #siteBody = null;
  #filteredComments = null;
  #filmComponent = null;
  #popUpComponent = null;

  #filmsComments = null;

  constructor(filmContainer, filmsComments) {
    this.#filmContainer = filmContainer;
    this.#filmsComments = filmsComments;
  }

  init = (film) => {
    this.#film = film;

    this.#siteBody = document.querySelector('body');
    this.#filteredComments = this.#filmsComments.filter((comment) => film.comments.includes(comment.filmId));
    this.#filmComponent = new FilmCardView(film);
    this.#popUpComponent = new PopUpView(film, this.#filteredComments);

    this.#filmComponent.setOpenPopUpClickHandler(this.#setOpenPopUpClickHandler);

    this.#popUpComponent.setClosePopUpClickHandler(this.#setClosePopUpClickHandler);

    render(this.#filmComponent, this.#filmContainer);
  }

  #createPopUp = () => {
    this.#siteBody.appendChild(this.#popUpComponent.element);
    this.#siteBody.setAttribute('class', 'hide-overflow');
    this.#popUpComponent.element.removeAttribute('hidden');
  }

  #removePopUp = () => {
    this.#siteBody.removeChild(this.#popUpComponent.element);
    this.#siteBody.removeAttribute('class', 'hide-overflow');
    this.#popUpComponent.element.setAttribute('hidden', '');
  }

  #setOpenPopUpClickHandler = () => {
    this.#createPopUp();
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #setClosePopUpClickHandler = () => {
    this.#removePopUp();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopUp();
    }
  };
}
