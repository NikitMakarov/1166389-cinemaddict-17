import PopUpView from '../view/popup-view.js';
import FilmCardView from '../view/film-card-view.js';
import {UserAction, UpdateType} from '../const.js';

import {render, replace, remove} from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmPresenter {
  #filmContainer = null;
  #changeData = null;
  #changeMode = null;

  #film = null;
  #mode = Mode.DEFAULT;

  #siteBody = null;
  #filmComponent = null;
  #popUpComponent = null;

  constructor(filmContainer, changeData, changeMode) {
    this.#filmContainer = filmContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopUpComponent = this.#popUpComponent;

    this.#siteBody = document.querySelector('body');

    this.#filmComponent = new FilmCardView(film);
    this.#popUpComponent = new PopUpView(film, this.#mode);

    this.#filmComponent.setOpenPopUpClickHandler(this.#setOpenPopUpClickHandler);
    this.#filmComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popUpComponent.setClosePopUpClickHandler(this.#setClosePopUpClickHandler);
    this.#popUpComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#popUpComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popUpComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popUpComponent.setDeleteClickHandler(this.#handleDeleteClick);
    this.#popUpComponent.setAddCommentHandler(this.#handleAddComment);

    if (prevFilmComponent === null || prevPopUpComponent === null) {
      render(this.#filmComponent, this.#filmContainer);
      return;
    }

    replace(this.#filmComponent, prevFilmComponent);

    if (this.#mode === Mode.POPUP) {
      const prevScrollPosition = prevPopUpComponent.element.scrollTop;
      replace(this.#popUpComponent, prevPopUpComponent);
      this.#popUpComponent._returnScrollTo(prevScrollPosition);
    }

    remove(prevFilmComponent);
    remove(prevPopUpComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#popUpComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#removePopUp();
    }
  };

  setUpdating = () => {
    this.#filmComponent.updateElement({
      isDisabled: true
    });

    this.#popUpComponent.updateElement({
      isDisabled: true
    });
  }

  setDeleting = () => {
    this.#popUpComponent.updateElement({
      isDisabled: true,
      isDeleting: true
    });
  };

  setCommenting = () => {
    this.#popUpComponent.updateElement({
      isDisabled: true
    });
  };

  setUpdatingAborting = () => {
    const resetFormState = () => {
      if (this.#mode !== Mode.DEFAULT) {
        this.#popUpComponent.updateElement({
          isDisabled: false
        });
      } else {
        this.#filmComponent.updateElement({
          isDisabled: false
        });
      }
    };

    if (this.#mode !== Mode.DEFAULT) {
      const popUpControls = this.#popUpComponent._getUpdatingControls();

      this.#popUpComponent._shakeElement(resetFormState, popUpControls);
    } else {
      const filmControls = this.#filmComponent._getUpdatingControls();

      this.#popUpComponent._shakeElement(resetFormState, filmControls);
    }
  };

  setDeletingAborting = (evt) => {
    const resetFormState = () => {
      this.#popUpComponent.updateElement({
        isDisabled: false,
        isDeleting: false
      });
    };

    const deletingComment = this.#popUpComponent._getDeletingComment(evt);

    this.#popUpComponent._shakeElement(resetFormState, deletingComment);
  };

  setCommentingAborting = () => {
    const resetFormState = () => {
      this.#popUpComponent.updateElement({
        isDisabled: false,
        inputComment: '',
        selectedEmoji: '',
        clickedInput: ''
      });
    };

    const commentForm = this.#popUpComponent._getCommentForm();

    this.#popUpComponent._shakeElement(resetFormState, commentForm);
  };

  #createPopUp = () => {
    this.#siteBody.appendChild(this.#popUpComponent.element);
    this.#siteBody.classList.add('hide-overflow');

    this.#changeMode();
    this.#mode = Mode.POPUP;
  };

  #removePopUp = () => {
    this.#siteBody.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);

    this.#mode = Mode.DEFAULT;
  };

  #handleWatchListClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === Mode.DEFAULT ? UpdateType.SHOW_FILM_LIST : UpdateType.SHOW_POPUP,
      {...this.#film, isWatchList: !this.#film.isWatchList}
    );
  };

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === Mode.DEFAULT ? UpdateType.SHOW_FILM_LIST : UpdateType.SHOW_POPUP,
      {...this.#film, isWatched: !this.#film.isWatched}
    );
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === Mode.DEFAULT ? UpdateType.SHOW_FILM_LIST : UpdateType.SHOW_POPUP,
      {...this.#film, isFavorite: !this.#film.isFavorite}
    );
  };

  #handleDeleteClick = (evt) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.SHOW_POPUP,
      {...this.#film},
      evt
    );
  };

  #handleAddComment = (state) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.SHOW_POPUP,
      state
    );
  };

  #setOpenPopUpClickHandler = (film) => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.SHOW_POPUP,
      film
    );
    this.#createPopUp();
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #setClosePopUpClickHandler = (film) => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.SHOW_FILM_LIST,
      film
    );
    this.#removePopUp();
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      document.addEventListener('keydown', this.#onEscKeyDown);
      this.#siteBody.removeChild(this.#popUpComponent.element);
      this.#removePopUp();
    }
  };
}
