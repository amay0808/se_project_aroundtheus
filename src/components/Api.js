class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
      headers: this.headers,
    })
      .then((res) => this._handleResponse(res))
      .catch((err) => this._handleError(err));
  }

  getUserInfo() {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: this.headers,
    })
      .then((res) => this._handleResponse(res))
      .catch((err) => this._handleError(err));
  }

  editProfile(name, about) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({
        name,
        about,
      }),
    })
      .then((res) => this._handleResponse(res))
      .catch((err) => this._handleError(err));
  }

  addCard(name, link) {
    return fetch(`${this.baseUrl}/cards`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        name,
        link,
      }),
    })
      .then((res) => this._handleResponse(res))
      .catch((err) => this._handleError(err));
  }

  deleteCard(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this.headers,
    })
      .then((res) => this._handleResponse(res))
      .catch((err) => this._handleError(err));
  }

  updateAvatar(avatarLink) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({
        avatar: avatarLink,
      }),
    })
      .then((res) => this._handleResponse(res))
      .catch((err) => this._handleError(err));
  }

  addLike(cardId) {
    return fetch(`${this.baseUrl}/cards/likes/${cardId}`, {
      method: "PUT",
      headers: this.headers,
    })
      .then((res) => this._handleResponse(res))
      .catch((err) => this._handleError(err));
  }

  removeLike(cardId) {
    return fetch(`${this.baseUrl}/cards/likes/${cardId}`, {
      method: "DELETE",
      headers: this.headers,
    })
      .then((res) => this._handleResponse(res))
      .catch((err) => this._handleError(err));
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _handleError(err) {
    console.error(err);
  }
}

const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/group-12",
  headers: {
    authorization: "c7f5c92f-7ce5-490b-8dc6-c25c01900635",
    "Content-Type": "application/json",
  },
});

export default api;
