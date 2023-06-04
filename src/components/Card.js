export default class Card {
  constructor(
    cardData,
    cardTemplateSelector,
    openImageModal,
    handleCardLike,
    handleCardUnlike,
    handleCardDelete,
    userId,
    cardList
  ) {
    if (!cardData) {
      throw new Error("Card data is not defined");
    }

    if (!cardData._id) {
      throw new Error("Card id is not defined");
    }

    if (!handleCardLike || typeof handleCardLike !== "function") {
      throw new Error("handleCardLike must be a function");
    }

    if (!handleCardUnlike || typeof handleCardUnlike !== "function") {
      throw new Error("handleCardUnlike must be a function");
    }

    this._id = cardData._id;
    this._userId = userId;
    this._cardData = cardData;
    this._cardTemplateSelector = cardTemplateSelector;
    this._openImageModal = () => openImageModal(this._cardData);
    this._handleLike = handleCardLike;
    this._handleUnlike = handleCardUnlike;
    this._handleDelete = handleCardDelete;
    this._cardList = cardList; // Store the cardList reference
  }

  isLiked() {
    return this._cardData.likes.some((like) => like._id === this._userId);
  }

  _deleteCard = () => {
    this._handleDelete(this._id);
  };
  _toggleLike = () => {
    const isLiked = this.isLiked();

    if (isLiked) {
      if (typeof this._handleUnlike === "function") {
        this._handleUnlike(this._cardData._id)
          .then((newCardData) => {
            console.log("newCardData inside handleLike:", newCardData); // Add this line
            this.updateLikes(newCardData.likes);
          })
          .catch((err) => console.error(err));
      } else {
        console.error(
          `this._handleUnlike is not a function: ${this._handleUnlike}`
        );
      }
    } else {
      if (typeof this._handleLike === "function") {
        this._handleLike(this._cardData._id)
          .then((newCardData) => {
            console.log("newCardData after like:", newCardData); // Add this line
            this.updateLikes(newCardData.likes);
          })
          .catch((err) => console.error(err));
      } else {
        console.error(
          `this._handleLike is not a function: ${this._handleLike}`
        );
      }
    }
  };
  updateLikes(likes) {
    console.log("Likes before update:", this._cardData.likes); // Add this line
    this._cardData.likes = likes;
    console.log("Likes after update:", this._cardData.likes); // Add this line
    this._renderLikes();
  }

  _renderLikes() {
    if (!this._cardData.likes) {
      throw new Error("Likes property is not defined on new card data");
    }

    console.log("Likes count before update:", this._likeCount.textContent); // Add this line
    this._likeButton.classList.toggle(
      "card__like-button_active",
      this.isLiked()
    );

    this._likeCount.textContent = this._cardData.likes.length;
    console.log("Likes count after update:", this._likeCount.textContent); // Add this line
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", this._toggleLike);
    this._cardImageEl.addEventListener("click", this._openImageModal);
    this._deleteButton.addEventListener("click", this._deleteCard);
  }

  _getElement() {
    const cardTemplate = document
      .querySelector(this._cardTemplateSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return cardTemplate;
  }

  generateCard() {
    const cardElement = this._getElement();
    cardElement.setAttribute("data-card-id", this._cardData._id);
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
    this._likeCount.textContent = this._cardData.likes.length;

    this._renderLikes(); // Render initial likes
    this._setEventListeners();

    // Hide the delete button if the current user isn't the card's owner
    if (this._cardData.owner._id !== this._userId) {
      this._deleteButton.style.display = "none";
    }

    // Store the card instance on the card element
    this._cardElement.cardInstance = this;

    return this._cardElement;
  }
}
