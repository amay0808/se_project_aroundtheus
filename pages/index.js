import FormValidator from "../components/FormValidator.js";
import Card from "../components/Card.js";
import {
  // handleProfileEditSubmit,
  openPopup,
  closePopup,
  openImageModal,
  closePopupOnOverlayClick,
} from "../components/utils/utils.js";

const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg ",
  },
];

const cardData = {
  name: "Yosemite Valley",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
};
const card = new Card(cardData, "#card-template");
card.getview(openImageModal);

initialCards.reverse();

//elements
const previewImageModal = document.querySelector("#preview__image-modal");
const previewImage = previewImageModal.querySelector(".modal__preview-image");
const previewTitle = previewImageModal.querySelector(".modal__preview-title");

const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditPopup = document.querySelector("#profile-edit-modal");
const profileCloseButton = document.querySelector("#modal-close-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileEditCloseButton = profileEditPopup.querySelector(
  "#modal-close-button"
);
const addNewCardButton = document.querySelector(".profile__add-button");

const addModal = document.querySelector("#add-modal");
const addModalCloseButton = addModal.querySelector("#add-modal-close-button");
const profileEditForm = profileEditPopup.querySelector(".modal__form");
const addCardFormElement = addModal.querySelector(".modal__form");
const cardListEl = document.querySelector(".card__list");

const cardTitleInput = addCardFormElement.querySelector(
  ".modal__input_type_title"
);
const cardUrlInput = addCardFormElement.querySelector(".modal__input_type_url");
const previewImageModalCloseButton = document.querySelector(
  "#preview-image-modal-close-button"
);
function fillProfileForm() {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
}
function renderCard(cardData, container) {
  const card = new Card(cardData, "#card-template");
  const cardElement = card.getview(openImageModal);
  container.prepend(cardElement);
}
// ...

// Add this function to handle the Add Card form submission
function handleAddCardFormSubmit(event) {
  event.preventDefault();
  const cardData = {
    name: cardTitleInput.value,
    link: cardUrlInput.value,
  };
  renderCard(cardData, cardListEl);
  addCardFormValidator.resetValidation(); // Reset the form validation
  addCardFormElement.reset(); // Reset the form fields
  closePopup(addModal);
}

// ...

// Add event listener for the Add Card form submission
addCardFormElement.addEventListener("submit", (event) => {
  handleAddCardFormSubmit(event);
});

// ...

// event handlers
profileEditButton.addEventListener("click", () => {
  fillProfileForm();
  openPopup(profileEditPopup);
});

addNewCardButton.addEventListener("click", () => {
  openPopup(addModal);
});
export function handleProfileEditSubmit(event) {
  event.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(profileEditPopup);
}

profileEditForm.addEventListener("submit", (event) => {
  handleProfileEditSubmit(event);
});

initialCards.forEach((cardData) => renderCard(cardData, cardListEl));
profileCloseButton.addEventListener("click", () => {
  closePopup(profileEditPopup);
});

addModalCloseButton.addEventListener("click", () => {
  closePopup(addModal);
});

previewImageModalCloseButton.addEventListener("click", () => {
  closePopup(previewImageModal);
});

profileEditPopup.addEventListener("mousedown", (e) => {
  closePopupOnOverlayClick(profileEditPopup, e);
});

addModal.addEventListener("mousedown", (e) => {
  closePopupOnOverlayClick(addModal, e);
});

previewImageModal.addEventListener("mousedown", (e) => {
  closePopupOnOverlayClick(previewImageModal, e);
});
const config = {
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__save-button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// enableValidation(config);
const profileEditFormValidator = new FormValidator(config, profileEditForm);
profileEditFormValidator.enableValidation();

const addCardFormValidator = new FormValidator(config, addCardFormElement);
addCardFormValidator.enableValidation();
