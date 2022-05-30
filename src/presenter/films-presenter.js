
import FilmsContainerView from '../view/films-container-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreBtnView from '../view/show-more-button-view.js';
import FilmSection from '../view/films-section.js';
import FilmsListView  from '../view/films-list-view.js';
import FilmsListEmptyView  from '../view/films-list-empty.js';
import FilmsTopRatedView from '../view/films-top-rated-view.js';
import FilmsMostCommentedView from '../view/films-most-commented-view.js';
import FilmPresenter from './film-presenter.js';

import {render, RenderPosition, remove} from '../framework/render.js';
import {updateItem} from '../utils/common.js';
import {sortFilmDate, sortFilmRating} from '../utils/task.js';
import {SortType} from '../const.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filmsComments = null;

  #filmsSection = new FilmSection();
  #filmsList = new FilmsListView();
  #filmsComponent = new FilmsContainerView();
  #sortComponent = new SortView();
  #noFilmComponent = new FilmsListEmptyView();
  #showMoreComponent = new ShowMoreBtnView();

  #listFilms = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilms = [];

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#listFilms = [...this.#filmsModel.films];
    this.#sourcedFilms = [...this.#filmsModel.films];
    this.#filmsComments = this.#filmsModel.comments;

    this.#renderFilmList();
  };

  #handleLoadMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listFilms.length) {
      remove(this.#showMoreComponent);
    }
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsComponent.element, this.#filmsComments, this.#handleFilmChange, this.#handleModeChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilmList = () => {
    this.#renderSort();
    this.#renderSection();
    this.#renderList();
    this.#renderDisplayedFilms();
    this.#renderTopRatedView();
    this.#renderMostCommentedView();
  };

  #renderFilms = (from, to) => {
    this.#listFilms
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  };

  #renderNoFilms = () => {
    render(this.#noFilmComponent, this.#filmsList.element, RenderPosition.AFTERBEGIN);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreComponent, this.#filmsList.element);

    this.#showMoreComponent.setShowMoreClickHandler(this.#handleLoadMoreButtonClick);
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleFilmChange = (updatedFilm) => {
    this.#listFilms = updateItem(this.#listFilms, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreComponent);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderDisplayedFilms();
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#listFilms.sort(sortFilmDate);
        break;
      case SortType.RATING:
        this.#listFilms.sort(sortFilmRating);
        break;
      default:
        this.#listFilms = [...this.#sourcedFilms];
    }

    this.#currentSortType = sortType;
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#filmsList.element, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderSection = () => {
    render(this.#filmsSection, this.#filmsContainer, RenderPosition.BEFOREEND);
  };

  #renderList = () => {
    render(this.#filmsList, this.#filmsSection.element, RenderPosition.BEFOREEND);
  };

  #renderDisplayedFilms = () => {
    if (this.#listFilms.length === 0) {
      this.#renderNoFilms();
    } else {
      render(this.#filmsComponent, this.#filmsList.element);
      this.#renderFilms(0, Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP));

      if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
        this.#renderShowMoreButton();
      }
    }
  };

  #renderTopRatedView = () => {
    render(new FilmsTopRatedView(), this.#filmsSection.element, RenderPosition.BEFOREEND);
  };

  #renderMostCommentedView = () => {
    render(new FilmsMostCommentedView(), this.#filmsSection.element, RenderPosition.BEFOREEND);
  };
}
