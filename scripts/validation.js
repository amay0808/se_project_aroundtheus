function showInputError(
  formEl,
  inputEl,
  errorMessage,
  { inputErrorClass, errorClass }
) {
  const errorMessageEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.add(inputErrorClass);
  errorMessageEl.textContent = errorMessage;
  errorMessageEl.classList.add(errorClass);
}

function hideInputError(formEl, inputEl, { inputErrorClass, errorClass }) {
  const errorMessageEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.remove(inputErrorClass);
  errorMessageEl.textContent = "";
  errorMessageEl.classList.remove(errorClass);
}

function checkInputValidity(formEl, inputEl, options) {
  if (!inputEl.validity.valid) {
    const errorMessage = inputEl.validationMessage;
    showInputError(formEl, inputEl, errorMessage, options);
    return;
  }

  hideInputError(formEl, inputEl, options);
}

function checkFormValidity(inputs) {
  return inputs.every((input) => input.validity.valid);
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
  const isFormValid = checkFormValidity(inputEls);

  if (isFormValid) {
    enableButton(submitButton, inactiveButtonClass);
  } else {
    disableButton(submitButton, inactiveButtonClass);
  }
}

function setEventListener(formEl, options) {
  const { inputSelector, submitButtonSelector, inactiveButtonClass } = options;
  const inputEls = [...formEl.querySelectorAll(inputSelector)];
  const submitButton = formEl.querySelector(submitButtonSelector);

  disableButton(submitButton, inactiveButtonClass);

  inputEls.forEach((inputEl) => {
    inputEl.addEventListener("input", (e) => {
      checkInputValidity(formEl, inputEl, options);
      toggleButtonState(inputEls, submitButton, options);
    });
  });
}

function setEventListeners(config) {
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      const formEl = input.closest("form");
      checkInputValidity(formEl, input, config);
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

const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

enableValidation(config);
setEventListeners(config);
