// Import statements
import FormValidator from "../components/FormValidator";
import Card from "../components/Card";
import { initialCards } from "../components/constants.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import ImagePopup from "../components/ImagePopup.js";
import "./index.css";

// DOM Elements
const profileEditButton = document.querySelector("#profile-edit-button");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const addNewCardButton = document.querySelector(".profile__add-button");
const cardListEl = document.querySelector(".card__list");
const cardTitleInput = document.querySelector("#add-modal-title-input");
const cardUrlInput = document.querySelector("#cardUrlInput");

// User Info
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

// Profile Edit Form
function fillProfileForm() {
  const { name, job } = userInfo.getUserInfo();
  profileTitleInput.value = name;
  profileDescriptionInput.value = job;
  profileEditPopup.open();
}

const profileEditForm = document.querySelector(".modal__form");

// Add Card Form
function handleAddCardFormSubmit() {
  const cardData = {
    name: cardTitleInput.value,
    link: cardUrlInput.value,
  };

  const cardElement = createCard(cardData);
  cardList.addItem(cardElement);
  addCardPopup.close();
}

// Popup Initialization
const profileEditPopup = new PopupWithForm(
  "#profile-edit-modal",
  (formData) => {
    userInfo.setUserInfo(formData);
  }
);

profileEditPopup.setEventListeners();

const addCardPopup = new PopupWithForm("#add-modal", handleAddCardFormSubmit);
addCardPopup.setEventListeners();

// Event Listeners
profileEditButton.addEventListener("click", fillProfileForm);

addNewCardButton.addEventListener("click", () => {
  addCardFormValidator.resetValidation();
  addCardPopup.open();
});

// Card-related Functions
function openImageModal(cardData) {
  imagePopup.open(cardData);
}

function createCard(cardData) {
  const card = new Card(cardData, "#card-template", openImageModal);
  return card.generateCard();
}

// Card Section
const cardList = new Section(
  {
    items: initialCards,
    renderer: (cardData) => {
      const cardElement = createCard(cardData);
      cardList.addItem(cardElement);
    },
  },
  ".card__list"
);

cardList.renderItems();

// Form Validation Configurations
const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__save-button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// Image Popup
const imagePopup = new ImagePopup("#preview__image-modal");
imagePopup.setEventListeners();

// Form Validators
const profileEditFormValidator = new FormValidator(
  config,
  document.querySelector("#profile-edit-modal form")
);
profileEditFormValidator.enableValidation();

const addCardFormValidator = new FormValidator(
  config,
  document.querySelector("#add-modal form")
);
addCardFormValidator.enableValidation();
