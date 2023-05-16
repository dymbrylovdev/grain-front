const {
  //https://api.kupitzerno.com/api/doc
  // REACT_APP_API_DOMAIN = "grain-api.me-interactive.net",
  // REACT_APP_API_DOMAIN = "api.kupitzerno.com",
  REACT_APP_API_DOMAIN = "grain-apidev.me-interactive.net",
  REACT_APP_GOOGLE_API_KEY = "7f9da232-66bd-4aa0-97de-928d75b7ea37",
} = process.env;

const protocol = "https:";
const API_DOMAIN = `${protocol}//${REACT_APP_API_DOMAIN}`;

const API_SEARCH_LOCATION_URI = `https://geocode-maps.yandex.ru/1.x/?apikey=7f9da232-66bd-4aa0-97de-928d75b7ea37`;

const PHONE_MASK = "+79666669209";

export { API_DOMAIN, API_SEARCH_LOCATION_URI, REACT_APP_GOOGLE_API_KEY, PHONE_MASK };
