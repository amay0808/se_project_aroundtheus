import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._confirmButton = this._popupElement.querySelector(".modal__close");
  }

  setConfirmHandler(handler) {
    this._confirmHandler = handler;
    this._confirmButton.addEventListener("click", this._confirmHandler);
  }

  close() {
    super.close();
    this._confirmButton.removeEventListener("click", this._confirmHandler);
  }
}
