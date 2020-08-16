import { TBidType } from "./bids";

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
  max_payment_term: number;
  max_full_price: number;
  min_full_price: number;
  max_distance: number;
  parameter_values: IMyFiltersParam[];
  point_prices: IPointPrice[];
  subscribed: boolean;
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
  max_distance?: number;
  parameter_values?: IParamValue[];
  point_prices?: IPointPriceForEdit[];
  subscribed?: boolean;
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
    max_distance?: number;
    parameter_values?: IParamValue[];
    point_prices?: IPointPriceForEdit[];
  };
}
