export default class Card {
  constructor(cardData, cardTemplateSelector) {
    this._cardData = cardData;
    this._cardTemplateSelector = cardTemplateSelector;
    this._cardElement = this._createCardElement();
  }

  _createCardElement() {
    const cardTemplate = document.querySelector(this._cardTemplateSelector)
      .content.firstElementChild;
    return cardTemplate.cloneNode(true);
  }

  _getCardElement(openImageModal) {
    const cardImageEl = this._cardElement.querySelector(".card__image");
    const cardTitleEl = this._cardElement.querySelector(".card__title");
    const likeButton = this._cardElement.querySelector(".card__like-button");
    const deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );

    deleteButton.addEventListener("click", () => {
      this._cardElement.remove();
    });

    likeButton.addEventListener("click", () => {
      likeButton.classList.toggle("card__like-button_active");
    });

    cardImageEl.addEventListener("click", () => {
      openImageModal(this._cardData);
    });

    cardImageEl.src = this._cardData.link;
    cardImageEl.alt = this._cardData.name;
    cardTitleEl.textContent = this._cardData.name;

    return this._cardElement;
  }

  getview(openImageModal) {
    return this._getCardElement(openImageModal);
  }
}
