import axios from "axios";

import { API_SEARCH_LOCATION_URI } from "../constants";

const callLocationApi = axios.create({
  baseURL: `${API_SEARCH_LOCATION_URI}`,
  headers: {
    Accept: "*/*",
  },
});

export const getLocation = q =>
  callLocationApi.get(`${API_SEARCH_LOCATION_URI}&format=json&geocode=${q}&lang=ru_RU`);
