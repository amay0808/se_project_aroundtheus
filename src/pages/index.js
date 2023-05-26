import api from "../components/Api";
import FormValidator from "../components/FormValidator";
import Card from "../components/Card";
import { initialCards } from "../utils/constants.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import ImagePopup from "../components/ImagePopup.js";
import "./index.css";

// DOM Elements
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

// Create an instance of the UserInfo class
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

function fillProfileForm() {
  const profileInfo = userInfo.getUserInfo();
  profileTitleInput.value = profileInfo.name;
  profileDescriptionInput.value = profileInfo.job;
}

// Profile Edit Form
function handleProfileEditSubmit(formData) {
  api
    .editProfile(formData.name, formData.job)
    .then((updatedInfo) => {
      userInfo.setUserInfo(updatedInfo.name, updatedInfo.about);
      profileEditPopup.close();
    })
    .catch((error) => {
      console.error(error);
    });
}

// PopupWithForm instance for Edit Profile
const profileEditPopup = new PopupWithForm(
  "#profile-edit-modal",
  handleProfileEditSubmit
);
profileEditPopup.setEventListeners();

// Event Listener for Profile Edit button
profileEditButton.addEventListener("click", () => {
  fillProfileForm();
  profileEditPopup.open();
});

// FormValidator instance for Edit Profile
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

// Add Card Form
function handleAddCardFormSubmit(cardData) {
  const cardElement = createCard(cardData);
  cardList.addItem(cardElement);
  addCardPopup.close();
}

// PopupWithForm instance for Add Modal
const addCardPopup = new PopupWithForm("#add-modal", handleAddCardFormSubmit);
addCardPopup.setEventListeners();

// Event Listener for Add Card button
addNewCardButton.addEventListener("click", () => {
  addCardPopup.open();
});

// FormValidator instance for Add Card
const addCardFormValidator = new FormValidator(
  formConfig,
  document.querySelector("#add-modal form")
);
addCardFormValidator.enableValidation();

function handleDeleteCardSubmit() {
  const cardIdInput = document.getElementById("delete-modal-card-id");
  const cardId = cardIdInput.value;
  const cardElement = document.querySelector(`.card[data-card-id="${cardId}"]`);

  api
    .deleteCard(cardId)
    .then(() => {
      cardElement.remove();
      deleteCardPopup.close();
    })
    .catch((error) => {
      console.error(`Failed to delete card: ${error}`);
    });
}

// Delete Card Form
function createCard(cardData) {
  const card = new Card(
    cardData,
    "#card-template",
    openImageModal,
    (cardId) => api.addLike(cardId),
    (cardId) => api.removeLike(cardId)
  );

  const cardElement = card.generateCard();
  const deleteButton = cardElement.querySelector(".card__delete-button");

  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      const cardElement = deleteButton.closest(".card");
      const cardId = cardElement.dataset.cardId;
      document.getElementById("delete-modal-card-id").value = cardId;

      deleteCardPopup.setSubmitHandler(() => {
        deleteCard(cardElement, cardId);
      });

      deleteCardPopup.open();
    });
  }

  // Return the cardElement inside the createCard function
  return cardElement;
}

function deleteCard(cardElement, cardId) {
  api
    .deleteCard(cardId)
    .then(() => {
      // If the deletion was successful, remove the card element from the DOM
      cardElement.remove();

      // Close the delete popup
      deleteCardPopup.close();
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your delete operation:",
        error
      );
    });
}

// PopupWithForm instance for Delete Card Modal
const deleteCardPopup = new PopupWithForm(
  "#delete-modal",
  handleDeleteCardSubmit
);
deleteCardPopup.setEventListeners();

// Image Popup
const imagePopup = new ImagePopup("#preview__image-modal");
imagePopup.setEventListeners();

// Card-related Functions
function openImageModal(cardData) {
  imagePopup.open(cardData);
}

// Card Section
// const cardList = new Section(
//   {
//     items: initialCards,
//     renderer: (cardData) => {
//       const cardElement = createCard(cardData);
//       cardList.addItem(cardElement);
//     },
//   },
//   ".card__list"
// );

// cardList.renderItems();

// Call API methods
api
  .getInitialCards()
  .then((data) => {
    const cardList = new Section(
      {
        items: data,
        renderer: (cardData) => {
          const cardElement = createCard(cardData);
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
