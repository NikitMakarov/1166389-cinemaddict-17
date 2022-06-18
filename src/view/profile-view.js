import AbstractView from '../framework/view/abstract-view.js';

const getUserProfileRank = (filmsWatched) => {
  if (filmsWatched > 0 && filmsWatched <= 10) {
    return 'Novice';
  } else if (filmsWatched > 10 && filmsWatched <= 20) {
    return 'Fan';
  } else if (filmsWatched > 20) {
    return 'Movie Buff';
  } else {
    return '';
  }
};

const createProfileTemplate = (films) => {
  const userProfileRank = getUserProfileRank(films.filter((film) => film.isWatched).length);

  return `<section class="header__profile profile">
    <p class="profile__rating">${userProfileRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class ProfileView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createProfileTemplate(this.#films);
  }
}
