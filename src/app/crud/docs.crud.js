import axios from "axios";

export const LEGACY_URL = "api/docs/legacy";


export function getLegacy() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(LEGACY_URL);
}
