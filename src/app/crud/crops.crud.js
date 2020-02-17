import axios from "axios";

const GET_CROPS_URL = "/api/crops";
const CROP_URL = "/api/crop";
const CROP_PARAMETER_URL = "/api/crop_parameter/";


export const getCrops = () => {
    return axios.get(GET_CROPS_URL);
}

export const createCrop = (params) => {
    return axios.post(CROP_URL, params);
}

export const editCrop = (id, params) => {
    return axios.put(`${CROP_URL}/${id}`, params)
}

export const editCropParam = (id, params) => {
    return axios.put(`${CROP_PARAMETER_URL}${id}`, params)
}

export const getCropParams = (id) => {
    return axios.get(`${CROP_URL}/${id}/parameters`)
}