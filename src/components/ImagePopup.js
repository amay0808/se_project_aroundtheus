import Popup from "./Popup.js";

export default class ImagePopup extends Popup {
  open(imageData) {
    const imageElement = this._popupElement.querySelector(
      ".modal__preview-image"
    );
    const imageCaption = this._popupElement.querySelector(
      ".modal__preview-title"
    );

    imageElement.src = imageData.link;
    imageElement.alt = imageData.name;
    imageCaption.textContent = imageData.name;

    super.open();
  }
}
