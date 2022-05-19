
import FilmsContainerView from '../view/films-container-view.js';
import NavigationView from '../view/navigation-view.js';
import FilterView from '../view/filter-view.js';
import ShowMoreBtnView from '../view/show-more-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmSection from '../view/films-section.js';
import FilmsListView  from '../view/films-list-view.js';
import FilmsListEmptyView  from '../view/films-list-empty.js';
import FilmsTopRatedView from '../view/films-top-rated-view.js';
import FilmsMostCommentedView from '../view/films-most-commented-view.js';
import PopUpView from '../view/popup-view.js';

import {render} from '../framework/render.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filmsComments = null;

  #filmsSection = new FilmSection();
  #filmsList = new FilmsListView();
  #filmsComponent = new FilmsContainerView();
  #showMoreComponent = new ShowMoreBtnView();

  #listFilms = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#listFilms = [...this.#filmsModel.films];
    this.#filmsComments = this.#filmsModel.comments;

    this.#renderFilmList();
  };

  #handleLoadMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#listFilms
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listFilms.length) {
      this.#showMoreComponent.element.remove();
      this.#showMoreComponent.removeElement();
    }
  };

  #renderFilm = (film) => {
    const siteBody = document.querySelector('body');
    const filteredComments = this.#filmsComments.filter((comment) => film.comments.includes(comment.filmId));
    const filmComponent = new FilmCardView(film);
    const popUpComponent = new PopUpView(film, filteredComments);

    const createPopUp = () => {
      siteBody.appendChild(popUpComponent.element);
      siteBody.setAttribute('class', 'hide-overflow');
      popUpComponent.element.removeAttribute('hidden');
    };

    const removePopUp = () => {
      siteBody.removeChild(popUpComponent.element);
      siteBody.removeAttribute('class', 'hide-overflow');
      popUpComponent.element.setAttribute('hidden', '');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        removePopUp();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
      createPopUp();
      document.addEventListener('keydown', onEscKeyDown);
    });

    popUpComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      removePopUp();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(filmComponent, this.#filmsComponent.element);
  };

  #renderFilmList = () => {
    render(new NavigationView(), this.#filmsContainer);
    render(new FilterView(), this.#filmsContainer);
    render(this.#filmsSection, this.#filmsContainer);
    render(this.#filmsList, this.#filmsSection.element);

    if (this.#listFilms.length === 0) {
      render(new FilmsListEmptyView(), this.#filmsList.element);
    } else {
      render(this.#filmsComponent, this.#filmsList.element);

      for (let i = 0; i < Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilm(this.#listFilms[i]);
      }

      if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
        render(this.#showMoreComponent, this.#filmsList.element);

        this.#showMoreComponent.element.addEventListener('click', this.#handleLoadMoreButtonClick);
      }
    }

    render(new FilmsTopRatedView(), this.#filmsSection.element);
    render(new FilmsMostCommentedView(), this.#filmsSection.element);
  };
}
