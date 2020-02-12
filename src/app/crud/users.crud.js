import axios from "axios";

export const USER_URL = "/api/user/";
export const USER_CREATE_URL = "/api/user/create";
export const GET_USERS_URL = "/api/users";
export const GET_STATUSES_URL = "/api/users/statuses";


export function createUser (data){
    return axios.post(USER_CREATE_URL, data);
} 

export function editUser(data, id){
    return axios.put(`${USER_URL}${id}/edit`, data);
}

export function deleteUser(id){
    return axios.delete(`${USER_URL}${id}`);
}

export function getUsers(params){
    return axios.get(GET_USERS_URL, params);
}

export function getStatuses(){
    return axios.get(GET_STATUSES_URL);
}


