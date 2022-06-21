import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeName} from '../utils/filter.js';
import {FilterType} from '../const.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {count, type} = filter;
  return `<a href="#${type}" class="main-navigation__item ${currentFilterType === type ? 'main-navigation__item--active' : ''}" value="${type}">${capitalizeName(type)} ${type === FilterType.ALL ? 'movies' : `<span class="main-navigation__item-count">${count}</span>`}</a>`;
};

const createNavigationTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = (filterItems) => filterItems
    .map((item) => createFilterItemTemplate(item, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    ${filterItemsTemplate(filters)}
  </nav>`;
};

export default class NavigationView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createNavigationTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeClickHandler = (callback) => {
    this._callback.filterTypeClick = callback;
    this.element.addEventListener('click', this.#filterTypeClickHandler);
  };

  #filterTypeClickHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeClick(evt.target.getAttribute('value'));
  };
}
