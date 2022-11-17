const {
  REACT_APP_API_DOMAIN = "grain-api.me-interactive.net",
  // REACT_APP_API_DOMAIN = "api.kupit-zerno.com",
  // REACT_APP_API_DOMAIN = "grain-apidev.me-interactive.net",
  REACT_APP_GOOGLE_API_KEY = "c1170a31-17b7-4be1-8db7-e068998ee7cd",
} = process.env;

const protocol = "https:";
const API_DOMAIN = `${protocol}//${REACT_APP_API_DOMAIN}`;

const API_SEARCH_LOCATION_URI = `https://geocode-maps.yandex.ru/1.x/?apikey=${REACT_APP_GOOGLE_API_KEY}`;

const PHONE_MASK = "+79666669209";

export { API_DOMAIN, API_SEARCH_LOCATION_URI, REACT_APP_GOOGLE_API_KEY, PHONE_MASK };
