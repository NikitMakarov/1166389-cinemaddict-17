import ProfileView from './view/profile-view.js';
import {render} from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsPresenter = new FilmsPresenter();

render(new ProfileView(), siteHeaderElement);

filmsPresenter.init(siteMainElement);
