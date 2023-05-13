export function openPopup(popup) {
  popup.classList.add("modal_opened");
  document.addEventListener("keydown", closeByEscape);
}

export function closePopup(popup) {
  popup.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeByEscape);
}

function closeByEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".modal_opened");
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

export function closePopupOnOverlayClick(popup, e) {
  if (e.target === popup) {
    closePopup(popup);
  }
}
