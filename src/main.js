import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ProfilePresenter from './presenter/profile-presenter.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './films-api-service.js';
import {END_POINT, AUTHORIZATION} from './const.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const profilePresenter = new ProfilePresenter(filmsModel, siteHeaderElement);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

profilePresenter.init();
filterPresenter.init();
filmsPresenter.init();
filmsModel.init();
