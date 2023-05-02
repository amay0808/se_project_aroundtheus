export default class Card {
  constructor(cardData, cardTemplateSelector) {
    this._cardData = cardData;
    this._cardTemplateSelector = cardTemplateSelector;
    const cardTemplate = document.querySelector(this._cardTemplateSelector)
      .content.firstElementChild;
    this._cardElement = cardTemplate.cloneNode(true);
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

  generateCard(openImageModal) {
    const card = this._getCardElement(openImageModal);
    return card;
  }
}
