import axios from "axios";
import { IFilterForCreate } from "../pages/home/myFilters/interfaces";

const MY_FILTERS_URL = "/api/bid_filter";

export const getMyFilters = () => {
  return axios.get(`${MY_FILTERS_URL}s`);
};

export const createMyFilter = (data: IFilterForCreate) => {
  return axios.post(`${MY_FILTERS_URL}/create_for_me`, data);
};

export const editMyFilter = (id: number, data: IFilterForCreate) => {
  return axios.put(`${MY_FILTERS_URL}/${id}`, data);
};

export const deleteMyFilter = (id: number) => {
  return axios.delete(`${MY_FILTERS_URL}/${id}`);
};
