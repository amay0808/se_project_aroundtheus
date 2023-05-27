export default class Card {
  constructor(
    cardData,
    cardTemplateSelector,
    openImageModal,
    handleLike,
    handleUnlike
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
  }

  _toggleLike = () => {
    const likeButtonIsActive = this._likeButton.classList.contains(
      "card__like-button_active"
    );

    if (!likeButtonIsActive) {
      this._handleLike(this._cardData._id)
        .then((newCardData) => {
          if (!newCardData) {
            throw new Error("New card data is not defined");
          }
          if (!newCardData.likes) {
            throw new Error("Likes property is not defined on new card data");
          }
          this._likeButton.classList.add("card__like-button_active");
          this._likeCount.textContent = newCardData.likes.length;
        })
        .catch((err) => console.error(err));
    } else {
      this._handleUnlike(this._cardData._id)
        .then((newCardData) => {
          if (!newCardData) {
            throw new Error("New card data is not defined");
          }
          if (!newCardData.likes) {
            throw new Error("Likes property is not defined on new card data");
          }
          this._likeButton.classList.remove("card__like-button_active");
          this._likeCount.textContent = newCardData.likes.length;
        })
        .catch((err) => console.error(err));
    }
  };

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
    const cardElement = cardTemplate.content.cloneNode(true);

    cardElement.querySelector(".card").dataset.cardId = this._id;
    this._cardElement = cardElement;
    this._cardImageEl = this._cardElement.querySelector(".card__image");
    this._cardTitleEl = this._cardElement.querySelector(".card__title");
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    this._likeCount = this._cardElement.querySelector(".card__like-count");

    this._cardImageEl.src = this._cardData.link;
    this._cardImageEl.alt = this._cardData.name;
    this._cardTitleEl.textContent = this._cardData.name;
    this._likeCount.textContent = this._cardData.likes.length;

    this._setEventListeners();

    return this._cardElement;
  }
}
