import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._confirmButton = this._popupElement.querySelector(".modal__close");
    this._confirmButtonText = this._confirmButton.textContent;
  }

  setConfirmHandler(handler) {
    this._confirmHandler = handler;
    this._confirmButton.addEventListener("click", this._confirmHandler);
  }

  close() {
    super.close();
    this._confirmButton.removeEventListener("click", this._confirmHandler);
    this.renderLoading(false); // Reset loading state when closing the popup
  }

  renderLoading(isLoading) {
    // Change the confirmation button text depending on whether loading is happening
    if (isLoading) {
      this._confirmButton.textContent = "Saving...";
    } else {
      this._confirmButton.textContent = this._confirmButtonText;
    }
  }
}
