export type TBidType = "sale" | "purchase";

export interface IBid {
  type: "sale" | "purchase";
  id: number;
  price: number;
  volume: number;
  description: string;
  is_pro: boolean;
  author: {
    id: number;
    fio: string;
    login: string;
    company: {
      id: number;
      short_name: string;
      colors?: string[];
    };
    use_vat: boolean;
  };
  createdAt: string;
  created_at: string;
  modified_at: string;
  vendor: {
    id: number;
    fio: string;
    login: string;
    company: {
      id: number;
      short_name: string;
      colors?: string[];
    };
    use_vat: boolean;
    company_confirmed_by_email?: boolean;
    company_confirmed_by_phone?: boolean;
    company_confirmed_by_payment?: boolean;
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
  price_with_delivery: number | null;
  price_with_delivery_with_vat: number | null;
  profit: number;
  vat: number | null;
  tariff: {
    id: number;
    name: string;
  };
  payment_term: number;
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
  payment_term?: number;
}

export interface IBestBids {
  equal: IBid[];
  inexact: IBid[];
}

export interface IProfit {
  bid_id: number;
  value: number;
}

export interface IPointPriceForGet {
  point_id: number;
  price: number;
}
