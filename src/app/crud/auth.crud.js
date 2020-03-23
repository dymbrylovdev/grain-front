import axios from "axios";

export const LOGIN_URL = "api/user/login";
export const REQUEST_PASSWORD_URL = "/api/_p/reset_password/send_code";
export const CHANGE_PASSWORD_URL = "/api/_p/change_password_from_link";
export const REGISTER_URL = "/api/_p/user/register";
export const ME_URL = "api/user/me";
export const USER_URL = "/api/user/";
export const GET_USER_URL = "/api/me";

export function login(login, password) {
  const bodyFormData = new FormData();
  bodyFormData.set('login', login);
  bodyFormData.set('password', password);
  return axios.post(LOGIN_URL, bodyFormData);
}

export function setUser(user){
  return axios.put(ME_URL, user);
}

export function getUser(){
  return axios.get(GET_USER_URL);
}

export function register(params) {
  return axios.post(REGISTER_URL, params);
}

export function requestPassword(email) {
  return axios.get(`${REQUEST_PASSWORD_URL}?email=${email}`);
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}

export function changePassword(params){
  return axios.post(CHANGE_PASSWORD_URL, params);
}
