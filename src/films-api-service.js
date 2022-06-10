import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  get comments() {
    return this._load({url: 'comments'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const {title, totalRating, release, runtime, genres, poster, alternativeTitle, description, ageRating, director, writers, actors, isFavorite, isWatchList, isWatched, comments, watchingDate} = film;
    const {date, releaseCountry} = release;
    const dateRelease = {
      'date': date !== null ? new Date(date) : date,
      'release_country': releaseCountry,
    };

    const userDetails = {
      'already_watched': isWatched,
      'favorite': isFavorite,
      'watching_date': watchingDate,
      'watchlist': isWatchList
    };

    const filmInfo = {
      'actors': actors,
      'age_rating': ageRating,
      'alternative_title': alternativeTitle,
      'description': description,
      'director': director,
      'genre': genres,
      'poster': poster,
      'release': dateRelease,
      'runtime': runtime,
      'title': title,
      'total_rating': totalRating,
      'writers': writers,
    };

    const adaptedFilmToServer = {...film,
      'comments': comments,
      'film_info': filmInfo,
      'user_details': userDetails,
    };

    delete adaptedFilmToServer.actors;
    delete adaptedFilmToServer.ageRating;
    delete adaptedFilmToServer.alternativeTitle;
    delete adaptedFilmToServer.totalRating;
    delete adaptedFilmToServer.description;
    delete adaptedFilmToServer.director;
    delete adaptedFilmToServer.genres;
    delete adaptedFilmToServer.poster;
    delete adaptedFilmToServer.release;
    delete adaptedFilmToServer.runtime;
    delete adaptedFilmToServer.title;
    delete adaptedFilmToServer.writers;
    delete adaptedFilmToServer.isWatchList;
    delete adaptedFilmToServer.isWatched;
    delete adaptedFilmToServer.isFavorite;
    delete adaptedFilmToServer.watchingDate;

    return adaptedFilmToServer;
  };
}
