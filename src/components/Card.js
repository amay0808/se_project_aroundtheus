export default class Card {
  constructor(
    cardData,
    cardTemplateSelector,
    openImageModal,
    handleLike,
    handleUnlike,
    handleDelete,
    userId
  ) {
    if (!cardData) {
      throw new Error("Card data is not defined");
    }

    if (!cardData._id) {
      throw new Error("Card id is not defined");
    }

    this._id = cardData._id;
    this._cardData = cardData;
    this._cardTemplateSelector = cardTemplateSelector;
    this._openImageModal = () => openImageModal(this._cardData);
    this._handleLike = handleLike;
    this._handleUnlike = handleUnlike;
    this._handleDelete = handleDelete;
    this._userId = userId;
    this._likes = this._cardData.likes;
  }

  isLiked() {
    return this._likes.some((like) => like._id === this._userId);
  }

  updateLikes(likes) {
    this._likes = likes;
    this._renderLikes();
  }

  _toggleLike = () => {
    if (this.isLiked()) {
      this._handleUnlike(this._id)
        .then((newCardData) => {
          this.updateLikes(newCardData.likes);
        })
        .catch((err) => console.error(err));
    } else {
      this._handleLike(this._id)
        .then((newCardData) => {
          this.updateLikes(newCardData.likes);
        })
        .catch((err) => console.error(err));
    }
  };

  _renderLikes() {
    const likeButtonIsActive = this.isLiked();

    if (likeButtonIsActive) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }

    this._likeCount.textContent = this._likes.length;
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", this._toggleLike);
    this._cardImageEl.addEventListener("click", this._openImageModal);
  }

  _getElement() {
    const cardTemplate = document
      .querySelector(this._cardTemplateSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    return cardTemplate;
  }

  generateCard() {
    const cardTemplate = document.querySelector(this._cardTemplateSelector);
    const cardElement = cardTemplate.content
      .querySelector(".card")
      .cloneNode(true);

    cardElement.dataset.cardId = this._id;
    this._cardElement = cardElement;
    this._cardImageEl = this._cardElement.querySelector(".card__image");
    this._cardTitleEl = this._cardElement.querySelector(".card__title");
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._likeCount = this._cardElement.querySelector(".card__like-count");

    this._cardImageEl.src = this._cardData.link;
    this._cardImageEl.alt = this._cardData.name;
    this._cardTitleEl.textContent = this._cardData.name;

    this._setEventListeners();
    this._renderLikes();

    return this._cardElement;
  }
}
