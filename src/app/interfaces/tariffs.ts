import { TRole } from "./users";
export interface ITariff {
  id: number;
  priority_places_bids_count: number;
  priority_places_bids_on_mailing_count: number;
  common_bids_count: number;
  max_filters_count: number;
  max_crops_count: number;
  tariff_period: ITariffPeriod;
  price: number;
  period: number;
  role: any;
  tariff: ITariffType;
}

export interface ITariffType {
  id: number;
  name: string;
}

export interface ITariffPeriod {
  id: number;
  period: number;
}
export interface ITariffToRequest {
  priority_places_bids_count?: number;
  priority_places_bids_on_mailing_count?: number;
  common_bids_count?: number;
  max_filters_count?: number;
  max_crops_count?: number;
  tariff_period?: ITariffPeriod;
  price?: number;
  period?: number;
}

export type TTariffField =
  | "priority_places_bids_count"
  | "priority_places_bids_on_mailing_count"
  | "common_bids_count"
  | "max_filters_count"
  | "max_crops_count"
  | "price"
  | "period";
  
