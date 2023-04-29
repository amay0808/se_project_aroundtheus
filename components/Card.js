import { openImageModal } from "./utils/utils.js";

export default class Card {
  constructor(cardData, cardTemplateSelector) {
    this._cardData = cardData;
    this._cardTemplateSelector = cardTemplateSelector;
  }

  _getCardElement(openImageModal) {
    const cardTemplate = document.querySelector(this._cardTemplateSelector)
      .content.firstElementChild;
    const cardElement = cardTemplate.cloneNode(true);
    const cardImageEl = cardElement.querySelector(".card__image");
    const cardTitleEl = cardElement.querySelector(".card__title");
    const likeButton = cardElement.querySelector(".card__like-button");
    const deleteButton = cardElement.querySelector(".card__delete-button");

    deleteButton.addEventListener("click", () => {
      cardElement.remove();
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

    return cardElement;
  }

  getview(openImageModal) {
    return this._getCardElement(openImageModal);
  }
}
