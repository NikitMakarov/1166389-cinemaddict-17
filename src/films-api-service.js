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

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  };

  getComments = async (film) => {
    const response = await this._load({
      url: `comments/${film.id}`,
      method: Method.GET
    });

    return await ApiService.parseResponse(response);
  };

  deleteComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE
    });

    return response;
  };

  addComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  #adaptToServer = (film) => {
    const {id, title, totalRating, release, runtime, genres, poster, alternativeTitle, description, ageRating, director, writers, actors, isFavorite, isWatchList, isWatched, comments, watchingDate} = film;
    const {date, releaseCountry} = release;
    const dateRelease = {
      'date': date !== null ? new Date(date) : date,
      'release_country': releaseCountry
    };

    const userDetails = {
      'already_watched': isWatched,
      'favorite': isFavorite,
      'watching_date': watchingDate,
      'watchlist': isWatchList
    };

    const filmInfo = {
      actors,
      'age_rating': ageRating,
      'alternative_title': alternativeTitle,
      description,
      director,
      'genre': genres,
      poster,
      'release': dateRelease,
      runtime,
      title,
      'total_rating': totalRating,
      writers
    };

    const adaptedFilmToServer = {
      id,
      comments,
      'film_info': filmInfo,
      'user_details': userDetails
    };

    return adaptedFilmToServer;
  };
}
