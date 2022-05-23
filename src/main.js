import ProfileView from './view/profile-view.js';
import {render} from './framework/render.js';
import NavigationView from './view/navigation-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel);

render(new NavigationView(), siteMainElement);
render(new ProfileView(), siteHeaderElement);

filmsPresenter.init();
