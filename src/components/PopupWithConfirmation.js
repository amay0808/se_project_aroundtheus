import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._confirmButton = this._popupElement.querySelector(".modal__close");
    this._confirmButtonText = this._confirmButton.textContent;
    this._confirmDeleteButton = this._popupElement.querySelector(
      ".modal__delete-button"
    );
  }

  setConfirmHandler(handler) {
    this._confirmHandler = handler;
    this._confirmButton.addEventListener("click", this._confirmHandler);
    this._confirmDeleteButton.addEventListener("click", this._confirmHandler);
  }

  close() {
    super.close();
    this._confirmButton.removeEventListener("click", this._confirmHandler);
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
}
