import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeDate, formatRuntime, formatRelativeTime} from '../utils/task.js';
import he from 'he';

const createPopUpTemplate = (data) => {
  const {title, totalRating, release, runtime, genres, poster, alternativeTitle, description, ageRating, director, writers, actors, isFavorite, isWatchList, isWatched, comments, selectedEmoji, inputComment, clickedInput} = data;
  const {releaseCountry} = release;
  const releaseDate = humanizeDate(release.date, 'DD MMM YYYY');

  const createGenreTemplate = (filmGenres) => {
    let template = '';
    for (const filmGenre of filmGenres) {
      template += `<span class="film-details__genre">${filmGenre}</span>`;
    }
    return template;
  };

  const updateCommentEmoji = (emoji) => emoji ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : '';

  const updateCommentText = (comment) => comment ? `${comment}` : '';

  const createCommentTemplate = (filmComments) => {
    let template = '';

    for (const filmComment of filmComments) {
      const {author, comment, date, emotion, id} = filmComment;
      const commentDate = humanizeDate(date, 'YYYY/MM/DD, h:mm');

      template += `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment ? he.encode(comment) : ''}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${formatRelativeTime(commentDate)}</span>
            <button class="film-details__comment-delete" id="${id}">Delete</button>
          </p>
        </div>
      </li>`;
    }
    return template;
  };

  return (`
  <section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${formatRuntime(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">${createGenreTemplate(genres)}</td>
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${isWatchList ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${isWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${isFavorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${data.mode === 'POPUP' ? createCommentTemplate(data.comments) : ''}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">${updateCommentEmoji(selectedEmoji)}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${updateCommentText(inputComment)}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${clickedInput === 'smile' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${clickedInput === 'sleeping' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${clickedInput === 'puke' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${clickedInput === 'angry' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
  </section>`
  );
};

export default class PopUpView extends AbstractStatefulView {
  _state = null;

  constructor(film, mode) {
    super();
    this._state = PopUpView.parseDataToState(film, mode);

    this.#setInnerHandlers();
  }

  get template() {
    return createPopUpTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setClosePopUpClickHandler(this._callback.closePopUp);
    this.setAddCommentHandler(this._callback.addComment);
  };

  setClosePopUpClickHandler = (callback) => {
    this._callback.closePopUp = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopUpClickHandler);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchListClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#deleteClickHandler);
  };

  setAddCommentHandler = (callback) => {
    this._callback.addComment = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#addInputHandler);
  };

  #addInputHandler = (evt) => {
    if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();

      if (this._state.inputComment && this._state.selectedEmoji) {
        this._callback.addComment(this._state);
      }
    }
  };

  #deleteClickHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    this._callback.deleteClick(evt);
  };

  #closePopUpClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopUp(this._state);
  };

  #watchListClickHandler = () => {
    this._callback.watchListClick();
  };

  #watchedClickHandler = () => {
    this._callback.watchedClick();
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.alt === 'emoji') {
      const emojiName = evt.target.parentNode.getAttribute('for').slice(6);
      const clickedInput = this.element.querySelector(`#emoji-${emojiName}`);

      this.updateElement({selectedEmoji: emojiName, clickedInput: clickedInput.value});
    }
  };

  #commentInputHandler = (evt) => {
    this._setState({
      inputComment: evt.target.value,
    });
  };

  _returnScrollTo = (prevPosition) => {
    this.element.scrollTo(0, prevPosition);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  };

  static parseDataToState = (film, mode) => ({
    ...film,
    inputComment: '',
    selectedEmoji: '',
    mode
  });
}
