export default class Card {
  constructor(
    cardData,
    cardTemplateSelector,
    openImageModal,
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
    this._handleDelete = handleDelete;
    this._userId = userId; // Added userId to keep track of current user
    this._likes = cardData.likes; // Added to store likes data locally
  }

  isLiked() {
    // Method to check if the card is liked by the current user
    return this._likes.some((like) => like._id === this._userId);
  }

  updateLikes(likes) {
    // Method to update likes after API response
    this._likes = likes;
    this._renderLikes(); // Update like button and like count here
  }

  _renderLikes() {
    // Method to render likes count and toggle like button class
    this._likeCount.textContent = this._likes.length;

    if (this.isLiked()) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
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

    cardElement.dataset.cardId = this._cardData._id;

    this._cardElement = cardElement;
    this._cardImageEl = this._cardElement.querySelector(".card__image");
    this._cardTitleEl = this._cardElement.querySelector(".card__title");
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._likeCount = this._cardElement.querySelector(".card__like-count");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );

    this._cardImageEl.src = this._cardData.link;
    this._cardImageEl.alt = this._cardData.name;
    this._cardTitleEl.textContent = this._cardData.name;

    this._setEventListeners();
    this._renderLikes(); // Rendering likes during card generation

    return this._cardElement;
  }
}
