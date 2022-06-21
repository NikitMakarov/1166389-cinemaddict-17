import AbstractView from '../framework/view/abstract-view.js';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButtonView extends AbstractView {
  get template() {
    return createShowMoreButtonTemplate();
  }

  setShowMoreClickHandler = (callback) => {
    this._callback.showMoreClick = callback;
    this.element.addEventListener('click', this.#showMoreClickHandler);
  };

  #showMoreClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showMoreClick();
  };
}
