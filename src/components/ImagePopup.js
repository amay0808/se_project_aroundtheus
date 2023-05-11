import ImagePopup from "./path/to/ImagePopup.js";

const imagePopup = new ImagePopup("#preview__image-modal");
imagePopup.setEventListeners();

// Open image popup when clicking on a card__image element
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("card__image")) {
    const imageData = {
      link: event.target.src,
      name: event.target.alt,
    };
    imagePopup.open(imageData);
  }
});
