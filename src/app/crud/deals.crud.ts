import axios from "axios";

const DEALS_URL = "/api/bids/pairs";

export const getDeals = (page: number, perPage: number, id: number) => {
  return axios.get(`${DEALS_URL}?page=${page}&per_page=${perPage}&filter_id=${id}`);
};
