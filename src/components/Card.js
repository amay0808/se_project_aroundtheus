export default class Card {
  constructor(cardData, cardTemplateSelector, openImageModal) {
    this._cardData = cardData;
    this._cardTemplateSelector = cardTemplateSelector;
    this._openImageModal = () => openImageModal(this._cardData);
  }
  _getElement() {
    return document
      .querySelector(this._cardTemplateSelector)
      .content.firstElementChild.cloneNode(true);
  }

  _setEventListeners() {
    this._deleteButton.addEventListener("click", this._deleteCard);
    this._likeButton.addEventListener("click", this._toggleLike);
    this._cardImageEl.addEventListener("click", this._openImageModal);
  }

  _deleteCard = () => {
    this._cardElement.remove();

    this._cardElement = null;
  };

  _toggleLike = () => {
    this._likeButton.classList.toggle("card__like-button_active");
  };

  generateCard() {
    this._cardElement = this._getElement();
    this._cardImageEl = this._cardElement.querySelector(".card__image");
    this._cardTitleEl = this._cardElement.querySelector(".card__title");
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );

    this._cardImageEl.src = this._cardData.link;
    this._cardImageEl.alt = this._cardData.name;
    this._cardTitleEl.textContent = this._cardData.name;

    this._setEventListeners();

    return this._cardElement;
  }
}
