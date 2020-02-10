import axios from "axios";

export const LOGIN_URL = "api/user/login";
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";


export const ME_URL = "api/user/me";
export const USER_URL = "/api/user/";

export function login(login, password) {
  const bodyFormData = new FormData();
  bodyFormData.set('login', login);
  bodyFormData.set('password', password);
  return axios.post(LOGIN_URL, bodyFormData);
}

export function setUser(user,id){
  if(id){
    return axios.put(`${USER_URL}${id}/edit`, user);
  }else{
    return axios.put(ME_URL, user);
  }
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}
