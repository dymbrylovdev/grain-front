import axios from "axios";

export const DOC_URL = "/api/document";
export const LEGACY_URL = "api/docs/legacy";
export const CREATE_DOC = "/api/document";
export const GET_DOCS = "/api/documents";
export const GET_PUBLIC_DOC = "​/api​/_public​/document​";

export function getLegacy() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(LEGACY_URL);
}

export function createDoc(data) {
  return axios.post(CREATE_DOC, data);
}

export function editDoc(code, data) {
  return axios.put(`${DOC_URL}/${code}/edit`, data);
}

export function getDoc(code) {
  return axios.get(`${DOC_URL}/${code}`);
}

export function getDocs(params) {
  return axios.get(GET_DOCS, params);
}

export function getPublicDoc(code) {
  return axios.get(`${GET_PUBLIC_DOC}/${code}`);
}
