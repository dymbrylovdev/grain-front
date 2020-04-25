import axios from "axios";
import { IFilterForBids } from "../interfaces/filters";
import { IBidToRequest, TBidType } from "../interfaces/bids";

const AD_URL = "/api/bid";

export const getBestBids = (type: TBidType, filter: IFilterForBids) => {
  return axios.post(`/api/bids/${type}/best`, filter);
};

export const getMyBids = (type: TBidType) => {
  return axios.get(`/api/my/bids?type=${type}`);
};

export const getAllBids = (cropId: number, type: TBidType, page: number, perPage: number) => {
  return axios.get(`/api/crop/${cropId}/bids?type=${type}&page=${page}&per_page=${perPage}`);
};

export const getBidById = (id: number) => {
  return axios.get(`${AD_URL}/${id}`);
};

export const createBid = (type: TBidType, data: IBidToRequest) => {
  return axios.post(`${AD_URL}/${type}`, data);
};

export const editBid = (id: number, data: IBidToRequest) => {
  return axios.put(`${AD_URL}/${id}`, data);
};

export const deleteBid = (id: number) => {
  return axios.delete(`${AD_URL}/${id}`);
};
