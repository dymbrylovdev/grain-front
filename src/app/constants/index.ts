const {
  REACT_APP_API_DOMAIN = "grain15-api.me-interactive.net",
  REACT_APP_GOOGLE_API_KEY = "aa407fc5-9701-4b1b-b1bb-b1d71b6d9d8a",
} = process.env;

const { protocol } = window.location;
const API_DOMAIN = `${protocol}//${REACT_APP_API_DOMAIN}`;

const API_SEARCH_LOCATION_URI = `https://geocode-maps.yandex.ru/1.x/?apikey=${REACT_APP_GOOGLE_API_KEY}`;

export { API_DOMAIN, API_SEARCH_LOCATION_URI };
