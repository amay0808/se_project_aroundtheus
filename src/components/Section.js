class Section {
  constructor({ items, renderer }, containerSelector) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  renderItems() {
    this._items.forEach((item) => {
      this._renderer(item);
    });
  }

  addItem(element) {
    this._container.prepend(element);
  }
  removeItem(itemId) {
    console.log(`Trying to remove item with id: ${itemId}`);
    console.log(this._container.innerHTML);
    const itemElement = this._container.querySelector(
      `[data-card-id="${itemId}"]`
    );
    console.log(`Found item element: `, itemElement);
    if (itemElement) {
      itemElement.remove();
      console.log(`Item with id: ${itemId} removed.`);
    }
  }
}
export default Section;
