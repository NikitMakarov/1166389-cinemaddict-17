import Observable from '../framework/observable.js';
import {generateFilm} from '../mock/film.js';
import {generateComment} from '../mock/comment.js';

export default class FilmsModel extends Observable {
  #films = Array.from({length: 17}, generateFilm);
  #comments = Array.from({length: 10}, generateComment);

  get comments() {
    return this.#comments;
  }

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    const updatedIndexes = update.comments.map((comment) => comment.filmId ? comment.filmId : comment);
    update.comments = updatedIndexes;

    this._notify(updateType, update);
  };

  deleteComment = (updateType, film, evt) => {
    const index = this.#comments.findIndex((comment) => comment.filmId === parseInt(evt.target.id, 10));

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
    update.comments = updatedIndexes;

    this.#comments.push(newComment);
    this._notify(updateType, update);
  };
}
