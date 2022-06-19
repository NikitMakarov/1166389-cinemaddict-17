import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatisticsTemplate = (films) => `<p>${films} movies inside</p>`;

export default class FooterStatisticsView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#films);
  }
}
