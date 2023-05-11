export default class Card {
  constructor(cardData, cardTemplateSelector, openImageModal) {
    this._cardData = cardData;
    this._cardTemplateSelector = cardTemplateSelector;
    this._openImageModal = openImageModal;

    const cardTemplate = document.querySelector(this._cardTemplateSelector)
      .content.firstElementChild;
    this._cardElement = cardTemplate.cloneNode(true);

    this._cardImageEl = this._cardElement.querySelector(".card__image");
    this._cardTitleEl = this._cardElement.querySelector(".card__title");
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );

    this._setEventListeners();
  }

  _setEventListeners() {
    this._deleteButton.addEventListener("click", () => {
      this._cardElement.remove();
    });

    this._likeButton.addEventListener("click", () => {
      this._likeButton.classList.toggle("card__like-button_active");
    });

    this._cardImageEl.addEventListener("click", () => {
      this._openImageModal(this._cardData);
    });
  }

  generateCard() {
    this._cardImageEl.src = this._cardData.link;
    this._cardImageEl.alt = this._cardData.name;
    this._cardTitleEl.textContent = this._cardData.name;

    return this._cardElement;
  }
}
