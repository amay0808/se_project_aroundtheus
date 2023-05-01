const previewImageModal = document.querySelector("#preview__image-modal");
const previewImage = previewImageModal.querySelector(".modal__preview-image");
const previewTitle = previewImageModal.querySelector(".modal__preview-title");

export function openPopup(popup) {
  popup.classList.add("modal_opened");
  document.addEventListener("keydown", closeByEscape);
}

export function closePopup(popup) {
  popup.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeByEscape);
}

function closeByEscape(evt) {
  const openedPopup = document.querySelector(".modal_opened");
  if (evt.key === "Escape" && openedPopup) {
    closePopup(openedPopup);
  }
}

export function closePopupOnOverlayClick(popup, e) {
  if (e.target === popup) {
    closePopup(popup);
  }
}

export function openImageModal(cardData) {
  previewImage.src = cardData.link;
  previewImage.alt = cardData.name;
  previewTitle.textContent = cardData.name;

  openPopup(previewImageModal);
}
