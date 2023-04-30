export function openPopup(popup) {
  popup.classList.add("modal_opened");
  document.addEventListener("keydown", (evt) => closeModalByEscape(popup, evt));
}

export function closePopup(popup) {
  popup.classList.remove("modal_opened");
  document.removeEventListener("keydown", (evt) =>
    closeModalByEscape(popup, evt)
  );
}

function closeModalByEscape(popup, evt) {
  if (evt.key === "Escape") {
    closePopup(popup);
  }
}

export function closePopupOnOverlayClick(popup, e) {
  if (e.target === popup) {
    closePopup(popup);
  }
}

export function openImageModal(cardData) {
  const previewImageModal = document.querySelector("#preview__image-modal");
  const previewImage = previewImageModal.querySelector(".modal__preview-image");
  const previewTitle = previewImageModal.querySelector(".modal__preview-title");

  previewImage.src = cardData.link;
  previewImage.alt = cardData.name;
  previewTitle.textContent = cardData.name;

  openPopup(previewImageModal);
}
