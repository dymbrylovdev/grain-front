import axios from "axios";

const DEALS_URL = "/api/bids/pairs";

export const getDeals = (page: number, perPage: number, id?: number) => {
  return axios.get(
    `${DEALS_URL}?page=${page}&per_page=${perPage}${!!id ? `&filter_id=${id}` : ""}`
  );
};

export const getDealsFilters = () => {
  return axios.post(`${DEALS_URL}/filters`);
};
