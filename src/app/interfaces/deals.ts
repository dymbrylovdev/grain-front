import { IUser } from "./users";

export interface IDeal {
  purchase_bid: {
    id: number;
    price: number;
    price_with_vat: number;
    volume: number;
    description: string;
    author: IUser;
    created_at: string;
    modified_at: string;
    vendor: IUser;
    payment_term: number;
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
          country: string;
          province: string;
          city: string;
          street: string;
          text: string;
          house: string;
        };
        price: number;
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
    vat: number;
    vendor_use_vat: boolean;
    is_archived: boolean;
    archived_to: Date;
  };
  sale_bid: {
    id: number;
    price: number;
    price_with_vat: number;
    volume: number;
    description: string;
    author: IUser;
    created_at: string;
    modified_at: string;
    vendor: IUser;
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
          country: string;
          province: string;
          city: string;
          street: string;
          text: string;
          house: string;
        };
        price: number;
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
    vat: number;
    vendor_use_vat: boolean;
    is_archived: boolean;
    archived_to: Date;
  };
  distance: number;
  profit_without_delivery_price: number;
  profit_with_delivery_price: number;
  delivery_price: number;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface IDealsFilter {
  id: number;
  crop: {
    id: number;
    name: string;
    vat: number;
  };
  parameters: [
    {
      id: number;
      name: string;
      type: "enum" | "number";
      enum: string[];
    }
  ];
}

export interface IDealsFilterForEdit {
  parameter_ids: number[];
}
