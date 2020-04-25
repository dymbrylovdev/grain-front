export type TBidType = "sale" | "purchase";

export interface IBid {
  id: number;
  price: number;
  volume: number;
  description: string;
  author: {
    id: number;
    fio: string;
    login: string;
    company: {
      id: number;
      short_name: string;
    };
  };
  createdAt: string;
  vendor: {
    id: number;
    fio: string;
    login: string;
    company: {
      id: number;
      short_name: string;
    };
  };
  location: {
    lat: number;
    lng: number;
    country: string;
    province: string;
    city: string;
    street: string;
    text: string;
    house: string;
  };
  crop_id: number;
  parameter_values: [
    {
      id: number;
      value: string;
      parameter_id: number;
    }
  ];
  point_prices: [
    {
      point: {
        id: number;
        name: string;
        lat: number;
        lng: number;
      };
      price_delivery: number;
      distance: number;
      price_delivery_per_km: number;
      price_with_delivery: number;
      profit: number;
    }
  ];
  distance: number;
  price_delivery_per_km: number;
  price_delivery: number;
  price_with_delivery: number;
  profit: number;
}

export interface IBidToRequest {
  price?: number;
  volume?: number;
  description?: string;
  location?: {
    lat?: number;
    lng?: number;
    country?: string;
    province?: string;
    city?: string;
    street?: string;
    text?: string;
    house?: string;
  };
  crop_id?: number;
  parameter_values?: [
    {
      value?: string;
      parameter_id?: number;
    }
  ];
  vendor_id?: number;
}

export interface IBestBids {
  equal: IBid[];
  inexact: IBid[];
}
