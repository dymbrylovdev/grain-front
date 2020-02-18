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

export const editCrop = (params, id) => {
    return axios.put(`${CROP_URL}/${id}`, params)
}

export const createCropParam = (params, id) => {
    return axios.post(`${CROP_URL}/${id}/parameter`,params)
}

export const editCropParam = (params, id) => {
    return axios.put(`${CROP_PARAMETER_URL}${id}`, params)
}

export const getCropParams = (id) => {
    return axios.get(`${CROP_URL}/${id}/parameters`)
}