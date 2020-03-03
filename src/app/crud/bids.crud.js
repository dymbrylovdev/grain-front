import axios from 'axios';

const GET_ADS_URL = "/api/bids/bests"; 
const AD_URL = "/api/bid"
const MY_ADS_URL = "/api/my/bids"
const CROP_URL = "/api/crop";

export const getBestBids = (params) => {
    return axios.post(GET_ADS_URL, params);
}

export const createBid = (values) => {
    return axios.post(AD_URL, values);
}

export const editBid = (id, params) => {
    return axios.put(`${AD_URL}/${id}`, params)
}

export const getMyBids = () => {
    return axios.get(MY_ADS_URL);
}

export const deleteBid = (id) => {
    return axios.delete(`${AD_URL}/${id}`)
}

export const getAllBids = (id, page) => {
    return axios.get(`${CROP_URL}/${id}/bids?page=${page||1}`)
}

export const getBidById = (id) => {
    return axios.get(`${AD_URL}/${id}`);
}