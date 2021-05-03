import axios from "axios";

export const USER_URL = "/api/user/";
export const USER_CREATE_URL = "/api/user/create";
export const GET_USERS_URL = "/api/users";
export const GET_STATUSES_URL = "/api/users/statuses";
export const GET_USER_ACTIVATE = "api/user_activate/send";
export const GET_USER_ROLES ="api/roles";

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

export function getUsers(page, perPage, tariffId, funnelStateId, userRolesId) {
  let url = `${GET_USERS_URL}?page=${page}&per_page=${perPage}${
    tariffId ? `&tariff=${tariffId}` : ""
    }${funnelStateId ? `&funnel_state=${funnelStateId}` : ""}${userRolesId ? `&roles=${userRolesId}` : ""}`;

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

export function createUserBidFilter( id, data ) {
  return axios.post(`${USER_URL}${id}/bid_filter`, data);
}

export function getUserRoles() {
  return axios.get(GET_USER_ROLES);
}

export function getUserBidFilters({ id, type }) {
  return axios.get(`${USER_URL}${id}/bid_filters?type=${type}`)
}

export function getUserFilters( email, phone ) {
  return axios.get(`/api/users/search${email ? `?email=${email}` : ""}${phone ? `?phone=${phone}` : ""}`)
}
