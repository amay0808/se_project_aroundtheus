import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleSubmit, loadingButtonText) {
    super(popupSelector);
    this._handleSubmit = handleSubmit;
    this._formElement = this._popupElement.querySelector("form");
    this._submitButton = this._formElement.querySelector(
      ".modal__button[type='submit']"
    );
    this._buttonText = this._submitButton.textContent;
    this._loadingButtonText = loadingButtonText;
  }

  close() {
    super.close();
    this._formElement.reset(); // resets the form inputs
  }

  renderLoading(isLoading) {
    if (isLoading) {
      this._submitButton.textContent = this._loadingButtonText;
    } else {
      this._submitButton.textContent = this._buttonText;
    }
  }

  _getInputValues() {
    const inputs = this._formElement.querySelectorAll("input");
    const inputValues = {};
    inputs.forEach((input) => {
      inputValues[input.name] = input.value;
    });
    return inputValues;
  }

  setEventListeners() {
    super.setEventListeners();

    this._formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      this._handleSubmit(this._getInputValues());
    });
  }
}
