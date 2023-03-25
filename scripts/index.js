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

initialCards.reverse();

//elements
const previewImageModal = document.querySelector("#preview__image-modal");
const previewImage = previewImageModal.querySelector(".modal__preview-image");
const previewTitle = previewImageModal.querySelector(".modal__preview-title");

const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditPopup = document.querySelector("#profile-edit-modal");
const profileCloseButton = document.querySelector("#profile-close-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileEditCloseButton = profileEditPopup.querySelector(
  "#modal-close-button"
);
const addNewCardButton = document.querySelector("#profile__add-button");
const addModal = document.querySelector("#add-modal");
const addModalCloseButton = addModal.querySelector("#add-modal-close-button");
const profileEditForm = profileEditPopup.querySelector(".modal__form");
const addCardFormElement = addModal.querySelector(".modal__form");
const cardListEl = document.querySelector(".card__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;

const cardTitleInput = addCardFormElement.querySelector(
  ".modal__input_type_title"
);
const cardUrlInput = addCardFormElement.querySelector(".modal__input_type_url");

const previewImageModalCloseButton = document.querySelector(
  "#preview-image-modal-close-button"
);
previewImageModalCloseButton.addEventListener("click", () => {
  closeModal(previewImageModal);
});

// Functions

function closePopup(popup) {
  popup.classList.remove("modal_opened");
}

function openModal(modal, cardData, previewImage, previewTitle) {
  previewImage.src = cardData.link;
  previewImage.alt = cardData.name;
  previewTitle.textContent = cardData.name;
  modal.classList.add("modal_opened");
}

function getCardElement(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  // image modal

  // const previewImageModalCloseButton = document.querySelector(
  //   "#preview-image-modal-close-button"
  // );

  // previewImageModalCloseButton.addEventListener("click", () => {
  //   closeModal(previewImageModal);
  // });

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewImageModal, cardData, previewImage, previewTitle);
  });

  cardImageEl.src = cardData.link;
  cardImageEl.alt = cardData.name;
  cardTitleEl.textContent = cardData.name;
  return cardElement;
}

//event handler

document.querySelectorAll(".modal__close").forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closePopup(popup));
});

function handleProfileEditSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(profileEditPopup);
}
function fillProfileForm() {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
}

function renderCard(cardData, wrapper) {
  const cardElement = getCardElement(cardData);
  wrapper.prepend(cardElement);
}

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const name = cardTitleInput.value;
  const link = cardUrlInput.value;
  renderCard({ name, link }, cardListEl);
  evt.target.reset();
}
profileEditButton.addEventListener("click", () => {
  console.log("Profile edit button clicked");
  openPopup(profileEditPopup);
});

addNewCardButton.addEventListener("click", () => {
  console.log("Add new card button clicked");
  openPopup(addModal);
});

function openPopup(popup) {
  console.log("Trying to open popup:", popup);
  popup.classList.add("modal_opened");
}

//event listeners

const closeButtons = document.querySelectorAll(".popup__close");

closeButtons.forEach((button) => {
  const popup = button.closest(".popup");
  button.addEventListener("click", () => closePopup(popup));
});

profileEditForm.addEventListener("submit", handleProfileEditSubmit);
addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);
profileEditButton.addEventListener("click", () => openPopup(profileEditPopup));
addNewCardButton.addEventListener("click", () => openPopup(addModal));

initialCards.forEach((cardData) => renderCard(cardData, cardListEl));
