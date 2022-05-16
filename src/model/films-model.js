import {generateFilm} from '../mock/film.js';
import {generateComment} from '../mock/comment.js';

export default class FilmsModel {
  #films = Array.from({length: 17}, generateFilm);
  #comments = Array.from({length: 10}, generateComment);

  get comments() {
    return this.#comments;
  }

  get films() {
    return this.#films;
  }
}
