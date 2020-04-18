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
