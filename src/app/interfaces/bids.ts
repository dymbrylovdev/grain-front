import { ITransport } from './options';
export type TBidType = "sale" | "purchase";


export interface IBid {
  type: "sale" | "purchase";
  id: number;
  price: number;
  volume: number;
  description: string;
  is_pro: boolean;
  is_filter_created: number;
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
    surname: string | null;
    firstName: string | null;
    lastName: string | null;
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
    phone?: string;
    surname?: string;
    firstname?: string;
    lastname?: string;
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
  transports: ITransport[];
  vat: number | null;
  tariff: {
    id: number;
    name: string;
  };
  payment_term: number;
  prepayment_amount: number;
  vendor_use_vat: boolean;
  is_archived: boolean;
  photos?: {
    id: number;
    path: string;
    main: boolean;
    name: string;
    extension: string;
    mimeType: string;
    small: string;
  }[];
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
  is_sending_email?: number;
  is_sending_sms?: number;
  is_archived?: boolean;
  archived_to?: Date | null;
}

export interface IBestBids {
  equal: IBid[];
  inexact: IBid[];
}

export interface IBidsPair {
  price: number;
  price_with_delivery: number;
}

export interface IProfit {
  bid_id: number;
  value: number;
}

export interface IPointPriceForGet {
  point_id: number;
  price: number;
}
