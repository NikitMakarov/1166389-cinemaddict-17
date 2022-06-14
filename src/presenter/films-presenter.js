import FilmsContainerView from '../view/films-container-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreBtnView from '../view/show-more-button-view.js';
import FilmSection from '../view/films-section.js';
import FilmsListView  from '../view/films-list-view.js';
import FilmsListEmptyView  from '../view/films-list-empty.js';
import FilmsTopRatedView from '../view/films-top-rated-view.js';
import FilmsMostCommentedView from '../view/films-most-commented-view.js';
import FilmsLoadingView from '../view/films-loading-view.js';
import FilmPresenter from './film-presenter.js';

import {render, RenderPosition, remove} from '../framework/render.js';
import {sortFilmDate, sortFilmRating} from '../utils/task.js';
import {filter} from '../utils/filter.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filterModel = null;

  #filmsSection = new FilmSection();
  #filmsList = new FilmsListView();
  #filmsComponent = new FilmsContainerView();
  #loadingComponent = new FilmsLoadingView();
  #noFilmComponent = null;
  #sortComponent = null;
  #showMoreComponent = null;
  #topRatedComponent = null;
  #mostViewedComponent = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(filmsContainer, filmsModel, filterModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderFilmList();
  };

  #handleLoadMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreComponent);
    }
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsComponent.element, this.#handleViewAction, this.#handleModeChange);
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

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  };

  #renderNoFilms = () => {
    this.#noFilmComponent = new FilmsListEmptyView(this.#filterType);
    render(this.#noFilmComponent, this.#filmsList.element);
  };

  #renderShowMoreButton = () => {
    this.#showMoreComponent = new ShowMoreBtnView();
    this.#showMoreComponent.setShowMoreClickHandler(this.#handleLoadMoreButtonClick);
    render(this.#showMoreComponent, this.#filmsList.element);
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update, evt) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#filmsModel.addComment(updateType, update);
        break;
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.deleteComment(updateType, update, evt);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.SHOW_POPUP:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.SHOW_FILM_LIST:
        this.#clearFilmBoard();
        this.#renderFilmList();
        break;
      case UpdateType.SHOW_BOARD:
        this.#clearFilmBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmList();
        break;
      case UpdateType.INIT_DATA:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearFilmBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmList();
        break;
    }
  };

  #clearFilmBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreComponent);
    remove(this.#mostViewedComponent);
    remove(this.#topRatedComponent);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmBoard();
    this.#renderSort();
    this.#renderDisplayedFilms();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#filmsList.element, RenderPosition.AFTERBEGIN);
  };

  #renderSection = () => {
    render(this.#filmsSection, this.#filmsContainer, RenderPosition.BEFOREEND);
  };

  #renderList = () => {
    render(this.#filmsList, this.#filmsSection.element, RenderPosition.BEFOREEND);
  };

  #renderDisplayedFilms = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const filmCount = this.films.length;

    if (filmCount === 0) {
      this.#renderNoFilms();
    } else {
      const films = this.films.slice(0, Math.min(filmCount, this.#renderedFilmCount));

      render(this.#filmsComponent, this.#filmsList.element);
      this.#renderFilms(films);

      if (filmCount > this.#renderedFilmCount) {
        this.#renderShowMoreButton();
      }
    }
  };

  #renderTopRatedView = () => {
    this.#topRatedComponent = new FilmsTopRatedView();
    render(this.#topRatedComponent, this.#filmsSection.element, RenderPosition.BEFOREEND);
  };

  #renderMostCommentedView = () => {
    this.#mostViewedComponent = new FilmsMostCommentedView();
    render(this.#mostViewedComponent, this.#filmsSection.element, RenderPosition.BEFOREEND);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsList.element);
  };
}
