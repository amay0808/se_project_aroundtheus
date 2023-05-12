import Popup from "./Popup.js";

export default class ImagePopup extends Popup {
  constructor(popupElement) {
    super(popupElement);
    this._imageElement = this._popupElement.querySelector(
      ".modal__preview-image"
    );
    this._imageCaption = this._popupElement.querySelector(
      ".modal__preview-title"
    );
  }

  open(imageData) {
    this._imageElement.src = imageData.link;
    this._imageElement.alt = imageData.name;
    this._imageCaption.textContent = imageData.name;

    super.open();
  }
}
