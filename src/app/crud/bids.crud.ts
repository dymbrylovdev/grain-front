import axios from "axios";
import { IFilterForBids, IFilterForBid, IParamValue } from "../interfaces/filters";
import { IBidToRequest, TBidType } from "../interfaces/bids";
import { ILocation } from "../interfaces/locations";
import { format } from "date-fns";

const AD_URL = "/api/bid";

export const getBestBids = (type: TBidType, filter: IFilterForBids) => {
  return axios.post(`/api/bids/${type}/best`, filter);
};

export const getMyBids = (type: TBidType, page: number, perPage: number) => {
  return axios.get(`/api/my/bids?type=${type}&page=${page}&per_page=${perPage}`);
};

export const delPhoto = (photoId: number) => {
  return axios.delete(`/api/bid_photo/${photoId}`)
}

export const editPhotoBid = (id: number, data: any, isArray?: boolean) => {
  return axios.put(`/api/bid/${id}`, { photos_base64: isArray ? data : [data] });
};

export const editOverloadBid = (id: number, overload: boolean, point_prices: Array<null | any>, location: object, distance?: number | null) => {
  return axios.post(`/api/bid/get/${id}`, {
    filter: {
      overload: overload,
      point_prices: point_prices,
      location: location,
      distance: distance,
    }
  });
};

export const getAllBids = (
  cropId: number,
  type: TBidType,
  page: number,
  perPage: number,
  minDate: Date | null = null,
  maxDate: Date | null = null,
  authorId: string = ""
) => {
  let min_date = "";
  let max_date = "";

  if (minDate) {
    min_date = format(minDate, "yyyy-MM-dd");
  }
  if (maxDate) {
    max_date = format(maxDate, "yyyy-MM-dd");
  }

  let url = `/api/crop/${cropId}/bids?type=${type}&page=${page}&per_page=${perPage}${
    min_date ? `&min_date=${min_date}` : ""
  }${max_date ? `&max_date=${max_date}` : ""}`;

  if (authorId && authorId !== 'only_users') {
    url += `&author_id=${authorId}`;
  }

  if (authorId === 'only_users') {
    url += '&only_users=1';
  } else {
    url += '&only_users=0';
  }

  return axios.get(url);
};

export const getBidById = (id: number, filter: IFilterForBid) => {  
  return axios.post(`${AD_URL}/get/${id}?find_transport=true`, filter);
};

export const getBestPrice = (
  type: TBidType,
  data: { crop_id: number; parameter_values?: IParamValue; location?: ILocation }
) => {
  return axios.post(`${AD_URL}s/best_pair?type=${type}`, data);
};

export const createBid = (
  type: TBidType,
  data: IBidToRequest | any,
  is_sending_email: number,
  is_sending_sms: number
) => {
  return axios.post(
    `${AD_URL}/${type}?is_sending_email=${is_sending_email}&is_sending_sms=${is_sending_sms}`,
    data
  );
};

export const editBid = (id: number, data: IBidToRequest) => {
  return axios.put(`${AD_URL}/${id}`, data);
};

export const deleteBid = (id: number) => {
  return axios.delete(`${AD_URL}/${id}`);
};

export const archiveBid = (id: number, is_archived: boolean) => {
  return axios.put(`${AD_URL}/${id}`, { is_archived });
};

export const getBidsXlsUrl = (
  id: number,
  type?: string,
  minDate?: string,
  maxDate?: string,
  authorId?: string
) => {
  let uri = `/api/crop/${id}/bids/xls?type=${type}&min_date=${minDate}&max_date=${maxDate}`;
  if (!!authorId) {
    if (authorId === 'only_users') {
      uri += '&only_users=1';
    } else {
      uri += `&author_id=${authorId}`
    }
  }
  return axios.get(uri, { responseType: "arraybuffer" });
};

export const archivedBId = (id: number) => axios.put(`/api/bid/archive/${id}`);


