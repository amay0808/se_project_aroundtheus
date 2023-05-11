import Popup from "./Popup.js";

class PopupWithForm extends Popup {
  constructor(popupSelector, submitCallback) {
    super(popupSelector);
    this._submitCallback = submitCallback;
    this._formElement = this._popupElement.querySelector("form");
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
      this._submitCallback(this._getInputValues());
      this.close();
    });
  }

  close() {
    this._formElement.reset();
    super.close();
  }
}
