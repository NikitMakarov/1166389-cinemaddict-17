import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeName} from '../utils/filter.js';

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;
  return `<a href="#${name}" class="main-navigation__item">${capitalizeName(name)} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createNavigationTemplate = (filters) => {
  const filterItemsTemplate = (filterItems) => filterItems
    .map((item) => createFilterItemTemplate(item))
    .join('');

  return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filterItemsTemplate(filters)}
  </nav>`;
};

export default class NavigationView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createNavigationTemplate(this.#filters);
  }
}
