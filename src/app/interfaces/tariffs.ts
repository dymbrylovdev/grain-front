import { TRole } from "./users";
export interface ITariff {
  id: number;
  is_default: boolean;
  price: number;
  role: ITariffRole;
  tariff: ITariffType;
  tariff_limits: ITariffLimits
  tariff_period: ITariffPeriod;
  period: any;
}

export interface ITariffType {
  id: number;
  name: string;
}

export interface ITariffRole {
  id: number;
  name: string;
}

export interface ITariffLimits {
  common_bids_count: number;
  contact_view_limit: number;
  id: number;
  max_crops_count: number;
  max_filters_count: number;
  max_sms_count: number;
  priority_places_bids_count: number;
  priority_places_bids_on_mailing_count: number;
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
  | "max_sms_count"
  | "contact_view_limit"
  | "price"
  | "period";
  
