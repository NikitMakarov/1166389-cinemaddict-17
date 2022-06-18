import {render, remove} from '../framework/render.js';
import ProfileView from '../view/profile-view.js';

export default class ProfilePresenter {
  #profileContainer = null;
  #profileComponent = null;
  #filmsModel = null;

  constructor(filmsModel, profileContainer) {
    this.#filmsModel = filmsModel;
    this.#profileContainer = profileContainer;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevProfileComponent = this.#profileComponent;

    this.#profileComponent = new ProfileView(this.#filmsModel.films);
    render(this.#profileComponent, this.#profileContainer);

    remove(prevProfileComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
