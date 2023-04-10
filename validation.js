function showInputError(formEl, inputEl, { inputErrorClass, errorClass }) {
  const errorMessageEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.add(inputErrorClass);
  errorMessageEl.textContent = inputEl.validationMessage;
  errorMessageEl.classList.add(errorClass);
}

function hideInputError(formEl, inputEl, { inputErrorClass, errorClass }) {
  const errorMessageEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.remove(inputErrorClass);
  errorMessageEl.textContent = "";
  errorMessageEl.classList.remove(errorClass);
}

function checkInputValidity(formEl, inputEl, options) {
  if (inputEl.name === "url" && !inputEl.validity.valid) {
    inputEl.setCustomValidity("Please enter a web address");
  } else {
    inputEl.setCustomValidity("");
  }

  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, options);
    return;
  }
  hideInputError(formEl, inputEl, options);
}

function disableButton(button, inactiveButtonClass) {
  button.classList.add(inactiveButtonClass);
  button.disabled = true;
}

function enableButton(button, inactiveButtonClass) {
  button.classList.remove(inactiveButtonClass);
  button.disabled = false;
}

function toggleButtonState(inputEls, submitButton, { inactiveButtonClass }) {
  let foundInvalid = false;
  inputEls.forEach((input) => {
    if (!input.validity.valid) {
      foundInvalid = true;
    }
  });

  if (foundInvalid) {
    disableButton(submitButton, inactiveButtonClass);
    return;
  }

  enableButton(submitButton, inactiveButtonClass);
}

function setEventListener(formEl, options) {
  const { inputSelector } = options;
  const inputEls = [...formEl.querySelectorAll(inputSelector)];
  const submitButton = formEl.querySelector(".modal__button");
  inputEls.forEach((inputEl) => {
    inputEl.addEventListener("input", (e) => {
      checkInputValidity(formEl, inputEl, options);
      toggleButtonState(inputEls, submitButton, options);
    });
  });
}

function enableValidation(options) {
  const formEls = [...document.querySelectorAll(options.formSelector)];
  formEls.forEach((formEl) => {
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    setEventListener(formEl, options);
  });
}
function closePopupOnOverlayClick(popup, e) {
  if (e.target === popup) {
    closePopup(popup);
  }
}
const profileEditModal = document.getElementById("profile-edit-modal");
const addImageModal = document.getElementById("add-modal");
const imagePreviewModal = document.getElementById("preview__image-modal"); // Renamed variable

profileEditModal.addEventListener("click", (e) =>
  closePopupOnOverlayClick(profileEditModal, e)
);
addImageModal.addEventListener("click", (e) =>
  closePopupOnOverlayClick(addImageModal, e)
);
imagePreviewModal.addEventListener(
  "click",
  (
    e // Updated variable name
  ) => closePopupOnOverlayClick(imagePreviewModal, e)
);

const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

enableValidation(config);
