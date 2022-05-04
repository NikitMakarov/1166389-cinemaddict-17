
import FilmsContainerView from '../view/films-container-view.js';
import NavigationView from '../view/navigation-view.js';
import FilterView from '../view/filter-view.js';
import ShowMoreBtnView from '../view/show-more-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmSection from '../view/films-section.js';
import FilmsListView  from '../view/films-list-view.js';
import FilmsTopRatedView from '../view/films-top-rated-view.js';
import FilmsMostCommentedView from '../view/films-most-commented-view.js';

import {render} from '../render.js';

export default class FilmsPresenter {
  filmsSection = new FilmSection();
  filmsList = new FilmsListView();
  filmsComponent = new FilmsContainerView();

  init = (filmsContainer) => {
    this.filmsContainer = filmsContainer;

    render(new NavigationView(), this.filmsContainer);
    render(new FilterView(), this.filmsContainer);
    render(this.filmsSection, this.filmsContainer);
    render(this.filmsList, this.filmsSection.getElement());
    render(this.filmsComponent, this.filmsList.getElement());

    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmsComponent.getElement());
    }

    render(new ShowMoreBtnView(), this.filmsList.getElement());
    render(new FilmsTopRatedView(), this.filmsSection.getElement());
    render(new FilmsMostCommentedView(), this.filmsSection.getElement());
  };
}
