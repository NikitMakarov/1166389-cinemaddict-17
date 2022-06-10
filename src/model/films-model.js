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
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      const updatedIndexes = updatedFilm.comments.map((comment) => comment.filmId ? comment.filmId : comment);
      updatedFilm.comments = updatedIndexes;

      this._notify(updateType, updatedFilm);
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

  #adaptToClient = (film) => {
    const {comments, film_info, user_details} = film;
    const {actors, age_rating, alternative_title, description, director, genre, poster, release, runtime, title, total_rating, writers} = film_info;
    const {already_watched, favorite, watching_date, watchlist} = user_details;
    const {date, release_country} = release;

    const dateRelease = {
      date: date !== null ? new Date(date) : date,
      releaseCountry: release_country,
    };

    const adaptedFilmToClient = {...film,
      comments: comments,
      actors: actors,
      ageRating: age_rating,
      alternativeTitle: alternative_title,
      description: description,
      genres: genre,
      director: director,
      poster: poster,
      release: dateRelease,
      runtime: runtime,
      title: title,
      totalRating: total_rating,
      writers: writers,
      watchingDate: watching_date !== null ? new Date(watching_date) : watching_date,
      isFavorite: favorite,
      isWatched: already_watched,
      isWatchList: watchlist
    };

    delete adaptedFilmToClient.film_info;
    delete adaptedFilmToClient.user_details;

    return adaptedFilmToClient;
  };
}
