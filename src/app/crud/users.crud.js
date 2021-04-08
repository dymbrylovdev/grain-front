import axios from "axios";

export const USER_URL = "/api/user/";
export const USER_CREATE_URL = "/api/user/create";
export const GET_USERS_URL = "/api/users";
export const GET_STATUSES_URL = "/api/users/statuses";
export const GET_USER_ACTIVATE = "api/user_activate/send";

export function createUser(data) {
  return axios.post(USER_CREATE_URL, data);
}

export function editUser(id, data) {
  return axios.put(`${USER_URL}${id}/edit`, data);
}

export function editContactViewContact(data) {
  return axios.put(`${USER_URL}me`, data);
}

export function deleteUser(id) {
  return axios.delete(`${USER_URL}${id}`);
}

export function getUsers(page, perPage, tariffId, funnelStateId, roles = []) {
  let url = `${GET_USERS_URL}?page=${page}&per_page=${perPage}${
    tariffId ? `tariff_id=${tariffId}` : ""
  }${funnelStateId ? `funnel_state_id=${funnelStateId}` : ""}`;

  if (roles.length) {
    url += `&roles=${roles.join(",")}`;
  }

  return axios.get(url);
}

export const getUserBids = id => {
  return axios.get(`api/user/${id}/bids`);
};

export const getUsersCrops = id => {
  return axios.get(`api/user/${id}/crops`);
};

export function getStatuses() {
  return axios.get(GET_STATUSES_URL);
}

export function getUserById(id) {
  return axios.get(`${USER_URL}${id}`);
}

export function getUserActivate(email) {
  return axios.get(`${GET_USER_ACTIVATE}?email=${email}`);
}
