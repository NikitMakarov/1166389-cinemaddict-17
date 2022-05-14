import ProfileView from './view/profile-view.js';
import PopUpView from './view/popup-view.js';
import {render} from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteBody = document.querySelector('body');
const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsPresenter();

render(new ProfileView(), siteHeaderElement);

filmsPresenter.init(siteMainElement, filmsModel);

for (const film of filmsModel.getFilms()) {
  const comments = filmsModel.getComments().filter((comment) => film.comments.includes(Number(comment.id)));

  render(new PopUpView(film, comments), siteBody);
}
