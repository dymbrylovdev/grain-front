import axios from "axios";
import { IDealsFilterForEdit } from "../interfaces/deals";

const DEALS_URL = "/api/bids/pairs";

export const getDeals = (page: number, perPage: number, weeks: number, id?: number) => {
  return axios.get(
    `${DEALS_URL}?page=${page}&per_page=${perPage}${
      !!id ? `&filter_id=${id}` : ""
    }&expire_at=${weeks}%20weeks`
  );
};

export const getDealsFilters = () => {
  return axios.post(`${DEALS_URL}/filters`);
};

export const editDealsFilter = (id: number, data: IDealsFilterForEdit) => {
  return axios.put(`${DEALS_URL}/filter/${id}`, data);
};
