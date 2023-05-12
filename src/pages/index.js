import FormValidator from "../components/FormValidator";
import Card from "../components/Card";
import { initialCards } from "../components/constants.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import "./index.css";
import ImagePopup from "../components/ImagePopup.js";

//elements
const profileEditButton = document.querySelector("#profile-edit-button");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const addNewCardButton = document.querySelector(".profile__add-button");
const cardListEl = document.querySelector(".card__list");
const cardTitleInput = document.querySelector(".modal__input_type_title");
const cardUrlInput = document.querySelector(".modal__input_type_url");

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

function fillProfileForm() {
  const { name, job } = userInfo.getUserInfo();
  profileTitleInput.value = name;
  profileDescriptionInput.value = job;
}

function handleProfileEditSubmit(formData) {
  userInfo.setUserInfo(formData);
  profileEditPopup.close();
}

function handleAddCardFormSubmit() {
  const cardData = {
    name: cardTitleInput.value,
    link: cardUrlInput.value,
  };

  const cardElement = createCard(cardData);
  cardList.addItem(cardElement);
  addCardPopup.close();
}

const profileEditPopup = new PopupWithForm(
  "#profile-edit-modal",
  handleProfileEditSubmit
);
profileEditPopup.setEventListeners();

const addCardPopup = new PopupWithForm("#add-modal", handleAddCardFormSubmit);
addCardPopup.setEventListeners();

profileEditButton.addEventListener("click", () => {
  fillProfileForm();
  profileEditPopup.open();
});

addNewCardButton.addEventListener("click", () => {
  addCardFormValidator.resetValidation();
  addCardPopup.open();
});

function openImageModal(cardData) {
  imagePopup.open(cardData);
}

function createCard(cardData) {
  const card = new Card(cardData, "#card-template", openImageModal);
  return card.generateCard();
}

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

const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__save-button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const imagePopup = new ImagePopup("#preview__image-modal");
imagePopup.setEventListeners();

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
