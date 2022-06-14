import ProfileView from './view/profile-view.js';
import {render} from './framework/render.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './films-api-service.js';
import {END_POINT, AUTHORIZATION} from './const.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(new ProfileView(), siteHeaderElement);

filterPresenter.init();
filmsPresenter.init();
filmsModel.init();
