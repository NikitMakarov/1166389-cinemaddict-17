import PopUpView from '../view/popup-view.js';
import FilmCardView from '../view/film-card-view.js';
import {UserAction, UpdateType, TimeLimit} from '../const.js';

import {render, replace, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

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
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

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
    const prevScrollPosition = this.#popUpComponent.element.scrollTop;
    this.#popUpComponent.updateElement({
      isDisabled: true
    });
    this.#popUpComponent.element.scrollTop = prevScrollPosition;
  };

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

  setDeletingAborting = (evt) => {
    const resetFormState = () => {
      const prevScrollPosition = this.#popUpComponent.element.scrollTop;
      this.#popUpComponent.updateElement({
        isDisabled: false,
        isDeleting: false,
        scrollTop: this.#popUpComponent.element.scrollTop
      });
      this.#popUpComponent.element.scrollTop = prevScrollPosition;
    };

    const deletingComment = this.#popUpComponent._getDeletingComment(evt);

    this.#popUpComponent._shakeElement(resetFormState, deletingComment);
  };

  setCommentingAborting = () => {
    const resetFormState = () => {
      const prevScrollPosition = this.#popUpComponent.element.scrollTop;
      this.#popUpComponent.updateElement({
        isDisabled: false,
        inputComment: '',
        selectedEmoji: '',
        clickedInput: ''
      });
      this.#popUpComponent.element.scrollTop = prevScrollPosition;
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
    this.#siteBody.removeChild(this.#popUpComponent.element);
    document.removeEventListener('keydown', this.#onEscKeyDown);

    this.#mode = Mode.DEFAULT;
  };

  #handleWatchListClick = async () => {
    this.#uiBlocker.block();
    try {
      await this.#changeData(
        UserAction.UPDATE_FILM,
        this.#mode === Mode.DEFAULT ? UpdateType.SHOW_FILM_LIST : UpdateType.SHOW_POPUP,
        {...this.#film, isWatchList: !this.#film.isWatchList}
      );
    } catch (err) {
      this.#uiBlocker.unblock();
      this.#updatingAborting();
    }
    this.#uiBlocker.unblock();
  };

  #handleWatchedClick = async () => {
    this.#uiBlocker.block();
    try {
      await this.#changeData(
        UserAction.UPDATE_FILM,
        this.#mode === Mode.DEFAULT ? UpdateType.SHOW_FILM_LIST : UpdateType.SHOW_POPUP,
        { ...this.#film, isWatched: !this.#film.isWatched }
      );
    } catch (err) {
      this.#uiBlocker.unblock();
      this.#updatingAborting();
    }
    this.#uiBlocker.unblock();
  };

  #handleFavoriteClick = async () => {
    this.#uiBlocker.block();
    try {
      await this.#changeData(
        UserAction.UPDATE_FILM,
        this.#mode === Mode.DEFAULT ? UpdateType.SHOW_FILM_LIST : UpdateType.SHOW_POPUP,
        { ...this.#film, isFavorite: !this.#film.isFavorite }
      );
    } catch (err) {
      this.#uiBlocker.unblock();
      this.#updatingAborting();
    }
    this.#uiBlocker.unblock();
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

  #updatingAborting = () => {
    const resetFormState = () => {
      const prevScrollPosition = this.#popUpComponent.element.scrollTop;
      this.#popUpComponent.updateElement({
        isDisabled: false
      });
      this.#popUpComponent.element.scrollTop = prevScrollPosition;
    };

    if (this.#mode !== Mode.DEFAULT) {
      const popUpControls = this.#popUpComponent._getUpdatingControls();

      this.#popUpComponent._shakeElement(resetFormState, popUpControls);
    } else {
      const filmControls = this.#filmComponent._getUpdatingControls();

      this.#popUpComponent._shakeElement(resetFormState, filmControls);
    }
  };

  #setOpenPopUpClickHandler = (film) => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.SHOW_POPUP,
      film
    );

    if (this.#mode === Mode.DEFAULT) {
      this.#createPopUp();
      document.addEventListener('keydown', this.#onEscKeyDown);
    }
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
      this.#removePopUp();
    }
  };
}
