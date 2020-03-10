import axios from 'axios';

const GET_COMPANY_URL = ""; 
const COMPANY_URL = ""


export const getCompanies = () => {
    return axios.post(GET_COMPANY_URL);
}

export const createCompany = (values) => {
    return axios.post(COMPANY_URL, values);
}

export const editCompany = (id, params) => {
    return axios.put(`${COMPANY_URL}/${id}`, params)
}

export const deleteCompany = (id) => {
    return axios.delete(`${COMPANY_URL}/${id}`)
}

export const getCompanyById = (id) => {
    return axios.get(`${COMPANY_URL}/${id}`);
}