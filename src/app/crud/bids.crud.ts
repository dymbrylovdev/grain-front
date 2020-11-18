import axios from "axios";
import { IFilterForBids, IFilterForBid } from "../interfaces/filters";
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

export const getBidById = (id: number, filter: IFilterForBid) => {
  return axios.post(`${AD_URL}/get/${id}`, filter);
};

export const createBid = (type: TBidType, data: IBidToRequest | any, is_filter_created: number) => {
  return axios.post(`${AD_URL}/${type}`, data, { params: { 'is_filter_created': is_filter_created } } );
};

export const editBid = (id: number, data: IBidToRequest) => {
  return axios.put(`${AD_URL}/${id}`, data);
};

export const deleteBid = (id: number) => {
  return axios.delete(`${AD_URL}/${id}`);
};
