import axios from "axios";

const DEALS_URL = "/api/bids/pairs";

export const getDeals = (filter_id: number) => {
  return axios.get(`${DEALS_URL}?filter_id=${filter_id}`);
};
