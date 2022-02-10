import { TBidType, IPointPriceForGet } from "./bids";
import { ILocation } from "./locations";

export interface IPointPrice {
  point: {
    id: number;
    name: string;
    lat: number;
    lng: number;
    country: string;
    province: string;
    city: string;
    street: string;
    text: string;
    house: string;
  };
  price: number;
}

export interface IPointPriceForEdit {
  point_id: number;
  price: number;
}

export interface IMyFiltersParam {
  parameter: IFilterParam;
  value: string | string[];
}

export interface IMyFilterItem {
  id?: number;
  name: string;
  crop: {
    id: number;
    name: string;
  };
  bid_type: TBidType;
  max_payment_term: number;
  max_full_price: number;
  min_full_price: number;
  min_prepayment_amount: number;
  max_distance: number;
  parameter_values: IMyFiltersParam[];
  point_prices: IPointPrice[];
  subscribed: boolean;
  is_sending_sms: boolean;
}

export interface IMyFilters {
  filters: IMyFilterItem[];
  filter_count: number;
}

export interface IParamValue {
  parameter_id: number;
  value: string | string[];
}

export interface IFilterForCreate {
  name?: string;
  cropId?: number;
  max_payment_term?: number;
  max_full_price?: number;
  min_full_price?: number;
  min_prepayment_amount?: number;
  max_distance?: number;
  parameter_values?: IParamValue[];
  point_prices?: IPointPriceForEdit[];
  subscribed?: boolean;
  is_sending_sms?: boolean;
  bid_type?: TBidType;
}

export interface IFilterParam {
  id: number;
  name: string;
  type: "enum" | "number";
  enum: string[];
}

export interface IFilterForBids {
  filter: {
    cropId?: number;
    max_payment_term?: number;
    max_full_price?: number;
    min_full_price?: number;
    min_prepayment_amount?: number;
    max_distance?: number;
    parameter_values?: IParamValue[];
    point_prices?: IPointPriceForEdit[];
    location?: ILocation;
  };
}
export interface IFilterForBid {
  filter: {
    point_prices: IPointPriceForGet[];
    location?: ILocation;
  };
}
