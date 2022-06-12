import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];
  #comments = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get comments() {
    return this.#comments;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT_DATA);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const filmClearComments = this.#insertComments(update, []);
      const response = await this.#filmsApiService.updateFilm(filmClearComments);
      const updatedFilm = this.#adaptToClient(response);
      const filmComments = await this.#filmsApiService.getComments(update);
      const fullFilm = this.#insertComments(updatedFilm, filmComments);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, fullFilm);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  };

  deleteComment = (updateType, film, evt) => {
    const buttonId = parseInt(evt.target.id, 10);
    const index = this.#comments.findIndex((comment) => comment.filmId === buttonId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments.splice(index, 1);
    this._notify(updateType, film);
  };

  addComment = (updateType, update) => {
    const newComment = {
      filmId: 1,
      author: 'mock author',
      comment: update.inputComment,
      date: new Date(),
      emotion: update.selectedEmoji
    };

    const updatedIndexes = update.comments.map((comment) => comment.filmId ? comment.filmId : comment);

    if (update.comments.length === 0) {
      updatedIndexes.push(newComment.filmId);
    }

    update.comments = updatedIndexes;

    this.#comments.push(newComment);
    this._notify(updateType, update);
  };

  #insertComments = (film, comments) => {
    const insertedComments = {...film,
      'comments': comments,
    };

    return insertedComments;
  };

  #adaptToClient = (film) => {
    const dateRelease = {
      'date': film.film_info.release.date !== null ? new Date(film.film_info.release.date) : film.film_info.release.date,
      'releaseCountry': film.film_info.release.release_country,
    };

    const adaptedFilmToClient = {...film,
      'comments': film.comments,
      'actors': film.film_info.actors,
      'ageRating': film.film_info.age_rating,
      'alternativeTitle': film.film_info.alternative_title,
      'description': film.film_info.description,
      'genres': film.film_info.genre,
      'director': film.film_info.director,
      'poster': film.film_info.poster,
      'release': dateRelease,
      'runtime': film.film_info.runtime,
      'title': film.film_info.title,
      'totalRating': film.film_info.total_rating,
      'writers': film.film_info.writers,
      'watchingDate': film.user_details.watching_date !== null ? new Date(film.user_details.watching_date) : film.user_details.watching_date,
      'isFavorite': film.user_details.favorite,
      'isWatched': film.user_details.already_watched,
      'isWatchList': film.user_details.watchlist
    };

    delete adaptedFilmToClient.film_info;
    delete adaptedFilmToClient.user_details;

    return adaptedFilmToClient;
  };
}
