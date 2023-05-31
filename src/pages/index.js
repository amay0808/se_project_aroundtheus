import api from "../utils/Api";
import FormValidator from "../components/FormValidator";
import Card from "../components/Card";
import { initialCards } from "../utils/constants.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import ImagePopup from "../components/ImagePopup.js";
import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
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

  // Instance of the UserInfo class
  const userInfo = new UserInfo({
    nameSelector: ".profile__title",
    jobSelector: ".profile__description",
    avatarSelector: ".profile__avatar",
  });

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

  // Delete Card Form
  function handleDeleteCardSubmit() {
    const cardIdInput = document.getElementById("delete-modal-card-id");
    const cardId = cardIdInput.value;
    const cardElement = document.querySelector(
      `.card[data-card-id="${cardId}"]`
    );

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

  // Create Card Element
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

    api
      .getUserInfo()
      .then((userInfo) => {
        if (userInfo._id === cardData.owner._id) {
          deleteButton.classList.add("card__delete-button--visible");
          deleteButton.addEventListener("click", () => {
            const cardElement = deleteButton.closest(".card");
            const cardId = cardElement.dataset.cardId;
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

  // Open Image Modal
  function openImageModal(cardData) {
    imagePopup.open(cardData);
  }

  // Event Listeners
  avatarEditButton.addEventListener("click", () => avatarPopup.open());

  profileEditButton.addEventListener("click", () => {
    const profileInfo = userInfo.getUserInfo();
    profileTitleInput.value = profileInfo.name;
    profileDescriptionInput.value = profileInfo.job;
    profileEditPopup.open();
  });

  avatarModalCloseButton.addEventListener("click", () => {
    avatarModal.classList.remove("modal_opened");
  });

  addNewCardButton.addEventListener("click", () => {
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

  // Popup Instances
  const avatarPopup = new PopupWithForm(
    "#edit-avatar-modal",
    handleAvatarFormSubmit,
    "Saving..."
  );
  avatarPopup.setEventListeners();

  const profileEditPopup = new PopupWithForm(
    "#profile-edit-modal",
    handleProfileEditSubmit,
    "Saving..."
  );
  profileEditPopup.setEventListeners();

  // PopupWithForm instance for Add Modal
  const addCardPopup = new PopupWithForm(
    "#add-modal",
    handleAddCardFormSubmit,
    "Saving..."
  );
  addCardPopup.setEventListeners();

  const deleteCardPopup = new PopupWithForm(
    "#delete-modal",
    handleDeleteCardSubmit
  );
  deleteCardPopup.setEventListeners();

  // Image Popup Instance
  const imagePopup = new ImagePopup("#preview__image-modal");
  imagePopup.setEventListeners();

  // Card List
  let cardList;
  api
    .getInitialCards()
    .then((data) => {
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
});
