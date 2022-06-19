import {render, remove} from '../framework/render.js';
import FooterStatisticsView from '../view/footer-statistics-view.js';

export default class StatisticsPresenter {
  #statisticsContainer = null;
  #statisticsComponent = null;
  #filmsModel = null;

  constructor(filmsModel, statisticsContainer) {
    this.#filmsModel = filmsModel;
    this.#statisticsContainer = statisticsContainer;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevStatisticsComponent = this.#statisticsComponent;

    this.#statisticsComponent = new FooterStatisticsView(this.#filmsModel.films.length);
    render(this.#statisticsComponent, this.#statisticsContainer);

    remove(prevStatisticsComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
