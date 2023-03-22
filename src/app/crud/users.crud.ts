import axios from "axios";

export const USER_URL = "/api/user/";
export const USER_CREATE_URL = "/api/user/create";
export const GET_USERS_URL = "/api/users";
export const GET_STATUSES_URL = "/api/users/statuses";
export const GET_USER_ACTIVATE = "api/user_activate/send";
export const GET_USER_ROLES = "api/roles";

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

export function getUsers(page, perPage, tariffId, funnelStateId, userRolesId, boughtTariff, userActive) {
  const notAdmin = userRolesId !== "ROLE_ADMIN";

  let url = `${GET_USERS_URL}?page=${page}&per_page=${perPage}${
    tariffId && notAdmin ? `&tariff=${tariffId}` : ""
  }${funnelStateId && notAdmin ? `&funnel_state=${funnelStateId}` : ""}${
    userRolesId ? `&roles=${userRolesId}` : ""
  }${boughtTariff ? `&bought_tariff=${1}` : ""}${
    userActive ? `&user_active=${userActive}` : ""}`;

  return axios.get(url);
}

export const getUserBids = (data: { userId: number; page: number; perPage: number }) => {
  return axios.get(`api/user/${data.userId}/bids?page=${data.page}&per_page=${data.perPage}`);
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

export function createUserBidFilter(id, data) {
  return axios.post(`${USER_URL}${id}/bid_filter`, data);
}

export function getUserRoles() {
  return axios.get(`${GET_USER_ROLES}`);
}

export function getUserBidFilters(params) {
  return axios.get(
    `${USER_URL}${params.id}/bid_filters` + (params.type ? `?type=${params.type}` : "")
  );
}

export function getUserFilters(email, phone) {
  return axios.get(
    `/api/users/search${email ? `?email=${email}` : ""}${phone ? `?phone=${phone}` : ""}`
  );
}
