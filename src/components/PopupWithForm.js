// import Popup from "./Popup.js";
import PopupWithConfirmation from "./PopupWithConfirmation.js";

export default class PopupWithForm extends PopupWithConfirmation {
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
  showLoading() {
    this._submitButton.textContent = this._loadingButtonText;
  }

  hideLoading() {
    this._submitButton.textContent = this._buttonText;
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
      this.close();
    });
  }

  close() {
    super.close();
    this._formElement.reset();
  }
}
