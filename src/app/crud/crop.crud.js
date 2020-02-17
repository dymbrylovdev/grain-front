import axios from "axios";

const GET_CROPS_URL = "/api/crops";


export const getCrops = () => {
    return axios.get(GET_CROPS_URL);
}