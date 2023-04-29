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

export function openImageModal(
  cardData,
  previewImageModal,
  previewImage,
  previewTitle
) {
  previewImage.src = cardData.link;
  previewImage.alt = cardData.name;
  previewTitle.textContent = cardData.name;
  openPopup(previewImageModal);
}
export function handleProfileEditSubmit(
  event,
  profileTitle,
  profileDescription,
  profileTitleInput,
  profileDescriptionInput,
  profileEditPopup,
  closePopup
) {
  event.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(profileEditPopup);
}
