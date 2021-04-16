const {
  REACT_APP_API_DOMAIN = "grain-api.me-interactive.net",
  REACT_APP_GOOGLE_API_KEY = "8cc65106-4ed1-4b48-afa1-c4e10938bcb8",
} = process.env;

const { protocol } = window.location;
const API_DOMAIN = `${protocol}//${REACT_APP_API_DOMAIN}`;

const API_SEARCH_LOCATION_URI = `https://geocode-maps.yandex.ru/1.x/?apikey=${REACT_APP_GOOGLE_API_KEY}`;

export { API_DOMAIN, API_SEARCH_LOCATION_URI };
