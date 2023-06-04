export default class Card {
  constructor(
    cardData,
    cardTemplateSelector,
    openImageModal,
    handleCardLike,
    handleCardDelete,
    userId,
    cardList
  ) {
    this._name = cardData.name;
    this._link = cardData.link;
    this._id = cardData._id;
    this._likes = cardData.likes;
    this._cardSelector = cardTemplateSelector;
    this._openImageModal = openImageModal;
    this._handleLike = handleCardLike;
    this._handleDelete = handleCardDelete;
    this._cardList = cardList;
    this._userId = userId;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return cardElement;
  }

  _setEventListeners() {
    this._element
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        this._handleLike(this);
      });

    this._element
      .querySelector(".card__image")
      .addEventListener("click", () => {
        this._openImageModal(this._cardData);
      });

    this._element
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        this._handleDelete(this._id);
      });
  }

  deleteCard() {
    this._element.remove();
    this._element = null;
  }

  updateLikes(likes) {
    this._likes = likes;
    this._renderLikes();
  }

  _renderLikes() {
    this._element.querySelector(".card__like-count").textContent =
      this._likes.length;
    this._element
      .querySelector(".card__like-button")
      .classList.toggle("card__like-button_active", this.isLiked());
  }

  isLiked() {
    return this._likes.some((like) => like._id === this._userId);
  }

  generateCard() {
    this._element = this._getTemplate();
    this._element.querySelector(".card__title").textContent = this._name;
    this._element.querySelector(".card__image").src = this._link;
    this._element.querySelector(".card__image").alt = this._name;

    this._renderLikes();

    if (this._userId !== this._ownerId) {
      this._element.querySelector(".card__delete-button").style.display =
        "none";
    }

    this._setEventListeners();

    return this._element;
  }
}
