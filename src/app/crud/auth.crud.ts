import axios from "axios";
import { IUserForEdit, IUserForRegister, IChangePasswordData, LoginType } from "../interfaces/users";

export const LOGIN_URL = "api/user/login";
export const REQUEST_PASSWORD_URL = "/api/_p/reset_password/send_code";
export const CHANGE_PASSWORD_URL = "/api/_p/change_password_from_link";
export const REGISTER_URL = "/api/_p/user/register";
export const ME_URL = "api/user/me";
export const USER_URL = "/api/user/";
export const GET_USER_URL = "/api/me";
export const LOGIN_BY_PHONE = "api/login/by_phone";
export const SEND_CODE = "api/login/send_code";

export const register = (data: IUserForRegister) => {
  return axios.post(REGISTER_URL, data);
};

export const login = (login: string, password: string) => {
  const bodyFormData = new FormData();
  bodyFormData.set("login", login);
  bodyFormData.set("password", password);
  return axios.post(LOGIN_URL, bodyFormData);
};

export const loginByPhone = (phone: string, code: string) => {
  return axios.post(`${LOGIN_BY_PHONE}?phone=${phone}&code=${code}`);
};

export const getMe = () => {
  return axios.get(GET_USER_URL);
};

export const editMe = (user: IUserForEdit) => {
  return axios.put(ME_URL, user);
};

export const requestPassword = (email: string) => {
  return axios.get(`${REQUEST_PASSWORD_URL}?email=${email}`);
};

export const changePassword = (data: IChangePasswordData) => {
  return axios.post(CHANGE_PASSWORD_URL, data);
};

export const sendCodeConfirm = (phone: string) => {
  return axios.post(`${SEND_CODE}?phone=${phone}`);
};

export const loginByJwt = (jwt: string) => {
  return axios.get(`api/_p/login_from_link?token=${jwt}`);
};

export const findInSystem = ({ value, type }: { value: string; type: LoginType }) => {
  return axios.get(`api/_p/user/find_in_system?${type}=${value}`);
};
