import axios from "axios";
import { IFilterForCreate } from "../interfaces/filters";
import { TBidType } from "../interfaces/bids";

const MY_FILTERS_URL = "/api/bid_filter";

export const getMyFilters = (type: TBidType) => {
  return axios.get(`${MY_FILTERS_URL}s?type=${type}`);
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

export const postMyFilter = (id: number) => {
  return axios.post(`${MY_FILTERS_URL}/by_bid/${id}`);
}
