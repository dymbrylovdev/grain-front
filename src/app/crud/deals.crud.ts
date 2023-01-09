import axios from "axios";
import { IDealsFilterForEdit } from "../interfaces/deals";

const DEALS_URL = "/api/bids/pairs";

export const getDeals = (
  page: number,
  perPage: number,
  weeks: number,
  term: number,
  min_prepayment_amount?: number,
  vendor_id?: number,
  crop_id?: number,
  id?: number,
) => {
  return axios.get(
    `${DEALS_URL}?page=${page}&per_page=${perPage}${
      !!id ? `&filter_id=${id}` : ""
    }&expire_at=${weeks}&max_payment_term=${term}${
      !!min_prepayment_amount ? `&min_prepayment_amount=${min_prepayment_amount}` : ""
    }${
      !!vendor_id ? `&vendor_id=${vendor_id}` : ""
    }${
      !!crop_id ? `&crop_id=${crop_id}` : ""
    }`
  );
};

export const getDealsFilters = () => {
  return axios.post(`${DEALS_URL}/filters`);
};

export const editDealsFilter = (id: number, data: IDealsFilterForEdit) => {
  return axios.put(`${DEALS_URL}/filter/${id}`, data);
};
