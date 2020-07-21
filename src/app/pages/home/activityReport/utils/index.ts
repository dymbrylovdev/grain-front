import { IFunnelState, IFunnelStateToRequest } from "../../../../interfaces/funnelStates";
import { TRole } from "../../../../interfaces/users";

export const initFunnelState = (funnelState: IFunnelState | undefined) => ({
  name: funnelState ? funnelState.name || "" : "",
  color: funnelState ? funnelState.color || "" : "",
  engagement: funnelState ? funnelState.engagement || "" : "",
  hint: funnelState ? funnelState.hint || "" : "",
});

export const getFunnelStateToRequest = (
  values: { [x: string]: any },
  role?: TRole
): IFunnelStateToRequest => {
  let params: IFunnelStateToRequest = {};
  if (values.name) params.name = values.name.trim();
  if (values.color) params.color = values.color;
  if (values.engagement) params.engagement = values.engagement;
  if (values.hint) params.hint = values.hint;
  if (role) params.role = role;

  return params;
};
