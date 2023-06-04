class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json(); // Make sure it's returning the response body as JSON
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _handleError(error) {
    console.error("API Error:", error);
    throw error;
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, { headers: this._headers })
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, { headers: this._headers })
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  editProfile(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    })
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  addCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    })
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    })
      .then(this._checkResponse)
      .catch(this._handleError);
  }
  addLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        return res.json(); // Make sure to return the parsed JSON data
      })
      .then((data) => {
        console.log("Response data:", data); // Add this line
        return data;
      })
      .catch(this._handleError);
  }

  removeLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    })
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  updateAvatar(avatarLink) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatarLink,
      }),
    })
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  loadData() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()])
      .then(([userInfo, initialCards]) => {
        return { userInfo, initialCards };
      })
      .catch(this._handleError);
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
