const {
  REACT_APP_API_DOMAIN = "grain15-api.me-interactive.net",
  REACT_APP_GOOGLE_API_KEY = "590dce10-c096-4079-bf75-8fe5e204f67c",
} = process.env;

const { protocol } = window.location;
const API_DOMAIN = `${protocol}//${REACT_APP_API_DOMAIN}`;

const API_SEARCH_LOCATION_URI = `https://geocode-maps.yandex.ru/1.x/?apikey=${REACT_APP_GOOGLE_API_KEY}`;

export { API_DOMAIN, API_SEARCH_LOCATION_URI };
