import api from "../utils/Api";
import FormValidator from "../components/FormValidator";
import Card from "../components/Card";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import ImagePopup from "../components/ImagePopup.js";
import "../pages/index.css";

// DOM Elements
const avatarImageElement = document.querySelector(".profile__avatar");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileEditButton = document.querySelector("#profile-edit-button");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const addNewCardButton = document.querySelector(".profile__add-button");
const cardListEl = document.querySelector(".card__list");
const cardTitleInput = document.querySelector("#add-modal-title-input");
const cardUrlInput = document.querySelector("#cardUrlInput");
const avatarEditButton = document.querySelector(".profile__hover-edit");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarModalCloseButton = document.querySelector(
  "#edit-avatar-modal-close-button"
);
const avatarForm = document.querySelector("#edit-avatar-form");
const avatarUrlInput = document.querySelector("#avatar-url-input");
const addModalCreateButton = document.getElementById(
  "edit-profile-create-button"
);

// Instance of the UserInfo class
let userId;
let userInfo;
let cardList; // Declare cardList outside of the scope

// Initialize API and retrieve user info and initial cards
api
  .loadData()
  .then(({ userInfo: userInfoData, initialCards }) => {
    userInfo = new UserInfo({
      nameSelector: ".profile__title",
      jobSelector: ".profile__description",
      avatarSelector: ".profile__avatar",
    });

    userInfo.setUserInfo(userInfoData.name, userInfoData.about);
    userInfo.setAvatar(userInfoData.avatar); // Avatar is set once and not updated with profile info
    userId = userInfoData._id;

    // Card List
    cardList = new Section(
      {
        items: initialCards,
        renderer: (cardData) => {
          const cardElement = createCard(cardData, userId);
          cardList.addItem(cardElement);
        },
      },
      ".card__list"
    );

    cardList.renderItems();
  })
  .catch((error) => {
    console.error(`Failed to get user info and initial cards: ${error}`);
  });

//Profile Edit Form
function handleProfileEditSubmit(formData) {
  profileEditPopup.showLoading();

  const nameInput = profileTitleInput;
  const jobInput = profileDescriptionInput;

  api
    .editProfile(nameInput.value, jobInput.value)
    .then((updatedInfo) => {
      userInfo.setUserInfo(updatedInfo.name, updatedInfo.about);
      profileEditPopup.close();
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      profileEditPopup.hideLoading();
    });
}

// Avatar Form
function handleAvatarFormSubmit(formData) {
  avatarPopup.showLoading();

  api
    .updateAvatar(formData.avatar)
    .then(() => {
      userInfo.setAvatar(formData.avatar);
      avatarPopup.close();
    })
    .catch((error) => {
      console.error(`Failed to update avatar: ${error}`);
    })
    .finally(() => {
      avatarPopup.hideLoading();
    });
}

// Add Card Form
function handleAddCardFormSubmit(formData) {
  addCardPopup.showLoading();
  api
    .addCard(formData.name, formData.link)
    .then((newCardData) => {
      if (newCardData && newCardData._id) {
        const cardElement = createCard(newCardData);
        cardList.addItem(cardElement);
        addCardPopup.close();
      } else {
        throw new Error("Invalid card data received from the server");
      }
    })
    .catch((error) => {
      console.error(`Failed to add card: ${error}`);
    })
    .finally(() => {
      addCardPopup.hideLoading();
    });
}

// Handle Card Delete
function handleCardDelete(cardId) {
  api
    .deleteCard(cardId)
    .then(() => {
      cardList.removeItem(cardId);
    })
    .catch((error) => {
      console.error(`Failed to delete card: ${error}`);
    });
}

function createCard(cardData, userId) {
  console.log(cardData); // Log the cardData

  const card = new Card(
    cardData,
    "#card-template",
    openImageModal,
    handleCardLike,
    handleCardDelete,
    userId,
    cardList
  );

  const cardElement = card.generateCard();

  return cardElement;
}

function openImageModal(cardData) {
  imagePopup.open(cardData);
}

// Handle Card Like
function handleCardLike(card) {
  if (card.isLiked()) {
    api
      .removeLike(card._id)
      .then((updatedCardData) => {
        card.updateLikes(updatedCardData.likes);
        return updatedCardData;
      })
      .catch((error) => {
        console.error(`Failed to remove like: ${error}`);
      });
  } else {
    api
      .addLike(card._id)
      .then((updatedCardData) => {
        card.updateLikes(updatedCardData.likes);
        return updatedCardData;
      })
      .catch((error) => {
        console.error(`Failed to add like: ${error}`);
      });
  }
}

avatarEditButton.addEventListener("click", () => avatarPopup.open());

profileEditButton.addEventListener("click", () => {
  const profileInfo = userInfo.getUserInfo();
  profileTitleInput.value = profileInfo.name;
  profileDescriptionInput.value = profileInfo.job;
  profileEditPopup.open();
});

avatarModalCloseButton.addEventListener("click", () => {
  avatarPopup.close();
});

addNewCardButton.addEventListener("click", () => {
  addCardFormValidator.resetValidation();
  addCardPopup.open();
});

// Form Validation
const formConfig = {
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const profileEditFormValidator = new FormValidator(
  formConfig,
  document.querySelector("#profile-edit-modal form")
);
profileEditFormValidator.enableValidation();

const addCardFormValidator = new FormValidator(
  formConfig,
  document.querySelector("#add-modal form")
);
addCardFormValidator.enableValidation();

// Enable/disable submit button for Edit Profile modal
const profileEditSubmitButton = document.querySelector(
  "#edit-profile-save-button"
);
profileEditSubmitButton.disabled = true;

const profileEditInputs = document.querySelectorAll(
  "#profile-edit-modal .modal__input"
);
profileEditInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (
      profileTitleInput.value.trim() !== "" &&
      profileDescriptionInput.value.trim() !== ""
    ) {
      profileEditSubmitButton.disabled = false;
    } else {
      profileEditSubmitButton.disabled = true;
    }
  });
});

// Popup Instances
const avatarPopup = new PopupWithForm(
  "#edit-avatar-modal",
  handleAvatarFormSubmit,
  "Saving...",
  api
);
avatarPopup.setEventListeners();

const profileEditPopup = new PopupWithForm(
  "#profile-edit-modal",
  handleProfileEditSubmit,
  "Saving...",
  api
);
profileEditPopup.setEventListeners();

// PopupWithForm instance for Add Modal
const addCardPopup = new PopupWithForm(
  "#add-modal",
  handleAddCardFormSubmit,
  "Saving...",
  api
);
addCardPopup.setEventListeners();

// Image Popup Instance
const imagePopup = new ImagePopup("#preview__image-modal");
imagePopup.setEventListeners();

// Card List
api
  .getInitialCards()
  .then((cardData) => {
    cardList = new Section(
      {
        items: cardData,
        renderer: (cardData) => {
          const cardElement = createCard(cardData, userId);
          cardList.addItem(cardElement);
        },
      },
      ".card__list"
    );

    cardList.renderItems();
  })
  .catch((error) => {
    console.error(error);
  });
