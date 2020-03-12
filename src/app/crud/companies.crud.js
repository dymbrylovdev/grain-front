import axios from 'axios';
import { getQueryString } from '../utils';

const GET_COMPANY_URL = "/api/companies"; 
const COMPANY_URL = "/api/company"
const SEARCH_COMPANY_URL = "/api/companies/search";


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

export const searchCompanies = (values) => {
    const params = getQueryString(values);
    return axios.get(`${SEARCH_COMPANY_URL}${params}`)
}