class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _handleError(error) {
    console.error(error);
    if (error instanceof Response) {
      error.json().then((data) => console.log(data));
    }
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/v1/${this._headers.group}/users/me`, {
      headers: {
        authorization: this._headers.authorization,
      },
    })
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  getInitialCards() {
    return fetch("https://around.nomoreparties.co/v1/group-12/cards", {
      headers: {
        authorization: "c7f5c92f-7ce5-490b-8dc6-c25c01900635",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        // if the server returns an error, reject the promise
        return Promise.reject(`Error: ${res.status}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  editProfile(name, about) {
    return fetch(`${this._baseUrl}/v1/${this._headers.group}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: this._headers.authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        about,
      }),
    })
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  addCard(name, link) {
    return fetch(`${this._baseUrl}/v1/${this._headers.group}/cards`, {
      method: "POST",
      headers: {
        authorization: this._headers.authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        link,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(`Error: ${res.status} - ${data.message}`);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/v1/${this._headers.group}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: this._headers.authorization,
      },
    })
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  addLike(cardId) {
    return fetch(
      `${this._baseUrl}/v1/${this._headers.group}/cards/likes/${cardId}`,
      {
        method: "PUT",
        headers: {
          authorization: this._headers.authorization,
        },
      }
    )
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  removeLike(cardId) {
    return fetch(
      `${this._baseUrl}/v1/${this._headers.group}/cards/likes/${cardId}`,
      {
        method: "DELETE",
        headers: {
          authorization: this._headers.authorization,
        },
      }
    )
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  updateAvatar(avatarLink) {
    return fetch(`${this._baseUrl}/v1/${this._headers.group}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: this._headers.authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: avatarLink,
      }),
    })
      .then(this._checkResponse)
      .catch(this._handleError);
  }
  getCardLikes(cardId) {
    return fetch(`${this._baseUrl}/v1/${this._headers.group}/cards/${cardId}`, {
      headers: {
        authorization: this._headers.authorization,
      },
    })
      .then(this._checkResponse)
      .then((data) => data.likes.length)
      .catch(this._handleError);
  }

  loadData() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()])
      .then(([userInfo, initialCards]) => {
        initialCards.forEach((card) => {
          card.likesCount = card.likes.length;
        });
        return { userInfo, initialCards };
      })
      .catch(this._handleError);
  }
}
const api = new Api({
  baseUrl: "https://around.nomoreparties.co",
  headers: {
    authorization: "c7f5c92f-7ce5-490b-8dc6-c25c01900635",
    group: "group-12",
  },
});

export default api;
