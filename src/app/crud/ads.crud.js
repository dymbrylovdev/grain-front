import axios from 'axios';

const GET_ADS_URL = "/api/bids/bests"; 
const AD_URL = "/api/bid"
const MY_ADS_URL = "/api/my/bids"

export const getBestAds = () => {
    return axios.get(GET_ADS_URL);
}

export const createAd = () => {
    return axios.post(AD_URL);
}

export const editAd = (id) => {
    return axios.put(`${AD_URL}/${id}`)
}

export const getMyAds = () => {
    return axios.get(MY_ADS_URL);
}