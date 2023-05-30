import api from "../utils/Api";
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
addModalCreateButton.addEventListener("click", function () {
  // Change the text of the button
  addModalCreateButton.textContent = "Creating...";
});

// Select the button
const editAvatarSaveButton = document.querySelector("#edit-avatar-save-button");

// Add an event listener to the button
editAvatarSaveButton.addEventListener("click", function () {
  // Change the text of the button
  editAvatarSaveButton.textContent = "Saving...";
});

// instance of the UserInfo class
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
  avatarSelector: ".profile__avatar",
});

function fillProfileForm() {
  const profileInfo = userInfo.getUserInfo();
  profileTitleInput.value = profileInfo.name;
  profileDescriptionInput.value = profileInfo.job;
  avatarUrlInput.value = profileInfo.avatar;
}

// Profile Edit Form
function handleProfileEditSubmit(formData) {
  profileEditPopup.showLoading();

  api
    .editProfile(formData.name, formData.job)
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

function openAvatarModal() {
  avatarModal.classList.add("modal_opened");
}

avatarForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const avatarUrl = avatarUrlInput.value;

  api
    .updateAvatar(avatarUrl)
    .then(() => {
      const avatarImage = document.querySelector(".profile__avatar");
      avatarImage.src = avatarUrl;

      console.log("Avatar updated successfully");
    })
    .catch((error) => {
      console.error(`Failed to update avatar: ${error}`);
    })
    .finally(() => {
      avatarModal.classList.remove("modal_opened");
    });
});

// event listener for avatar edit button
avatarEditButton.addEventListener("click", openAvatarModal);

// PopupWithForm instance for Edit Profile
const profileEditPopup = new PopupWithForm(
  "#profile-edit-modal",
  handleProfileEditSubmit,
  "Saving..."
);
profileEditPopup.setEventListeners();

// event listener for profile edit button
profileEditButton.addEventListener("click", () => {
  fillProfileForm();
  profileEditPopup.open();
});
function closeAvatarModal() {
  avatarModal.classList.remove("modal_opened");
}

// Adding event listener to close button
avatarModalCloseButton.addEventListener("click", closeAvatarModal);

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

function handleAddCardFormSubmit(formData) {
  console.log(formData);

  const cardName = formData.name;
  const cardLink = formData.link;

  api
    .addCard(cardName, cardLink)
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
    });
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

  console.log("cardId: ", cardId); // log cardId value
  console.log("cardElement: ", cardElement); // log cardElement value

  if (!cardId || !cardElement) {
    console.error("Card ID or Card Element not found");
    return;
  }

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
  // console.log(cardData);
  const card = new Card(
    cardData,
    "#card-template",
    openImageModal,
    (cardId) => api.addLike(cardId),
    (cardId) => api.removeLike(cardId)
  );

  const cardElement = card.generateCard();
  const deleteButton = cardElement.querySelector(".card__delete-button");

  api
    .getUserInfo()
    .then((userInfo) => {
      if (userInfo._id === cardData.owner._id) {
        deleteButton.classList.add("card__delete-button--visible");
        deleteButton.addEventListener("click", () => {
          const cardElement = deleteButton.closest(".card");
          const cardId = cardElement.dataset.cardId;
          console.log("Setting cardId: ", cardId);
          document.getElementById("delete-modal-card-id").value = cardId;

          deleteCardPopup.open();
        });
      } else {
        deleteButton.classList.remove("card__delete-button--visible");
      }
    })
    .catch((error) => {
      console.error(`Failed to get user info: ${error}`);
    });

  return cardElement;
}

// Return the cardElement inside the createCard function

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

// Call API methods
let cardList;
api
  .getInitialCards()
  .then((data) => {
    console.log(data); // Add this line
    cardList = new Section(
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
