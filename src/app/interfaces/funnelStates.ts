import { TRole } from "./users";

export interface IFunnelState {
  id: number;
  name: string;
  hint: string;
  color: string;
  engagement: number;
  auto: boolean;
  code: string;
  role: TRole;
}

export interface IFunnelStateToRequest {
  name?: string;
  hint?: string;
  color?: string;
  engagement?: number;
  role?: TRole;
}

export interface IFunnelStatesReport {
  funnel_state: IFunnelState;
  role: string;
  count_users_by_role: number;
  count_users: number;
  percent_from_users_by_role: number;
  created_at: string;
  count_users_by_funnel_state: number;
}
