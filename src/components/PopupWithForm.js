import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleSubmit, loadingButtonText, api) {
    super(popupSelector);
    this._handleSubmit = handleSubmit;
    this._formElement = this._popupElement.querySelector("form");
    this._submitButton = this._formElement.querySelector(
      ".modal__button[type='submit']"
    );
    this._buttonText = this._submitButton.textContent;
    this._loadingButtonText = loadingButtonText;
    this._api = api;
  }
  renderLoading(isLoading) {
    console.log("renderLoading called with: ", isLoading);
    if (isLoading) {
      this._submitButton.textContent = this._loadingButtonText;
    } else {
      this._submitButton.textContent = this._buttonText;
    }
    console.log(
      "Button text after renderLoading: ",
      this._submitButton.textContent
    );
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
      console.log("Form submit event triggered");
      this.renderLoading(true);

      const inputValues = this._getInputValues();
      Promise.resolve(this._handleSubmit(inputValues, this._api))
        .then(() => {
          this.close();
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.renderLoading(false);
        });
    });
  }

  close() {
    super.close();
    this._formElement.reset();
  }
}
