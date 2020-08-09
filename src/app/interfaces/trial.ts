import { TRole } from "./users";

export interface ITrial {
  id: number;
  name: string;
  role: TRole;
  priority_places_bids_count: number;
  priority_places_bids_on_mailing_count: number;
  common_bids_count: number;
  max_filters_count: number;
  max_crops_count: number;
}

export interface ITrialToRequest {
  priority_places_bids_count?: number;
  priority_places_bids_on_mailing_count?: number;
  common_bids_count?: number;
  max_filters_count?: number;
  max_crops_count?: number;
}

