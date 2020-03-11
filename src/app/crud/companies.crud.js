import axios from 'axios';

const GET_COMPANY_URL = "/api/companies"; 
const COMPANY_URL = "/api/company"


export const getCompanies = page => {
    return axios.get(`${GET_COMPANY_URL}?page=${page}`);
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