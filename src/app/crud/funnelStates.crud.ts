import axios from "axios";
import { IFunnelStateToRequest } from "../interfaces/funnelStates";

export const FUNNEL_STATE_URL = "/api/funnel_state";

export const getFunnelStates = () => {
  return axios.get(`${FUNNEL_STATE_URL}s`);
};

export const addFunnelState = (data: IFunnelStateToRequest) => {
  return axios.post(FUNNEL_STATE_URL, data);
};

export const editFunnelState = (id: number, data: IFunnelStateToRequest) => {
  return axios.put(`${FUNNEL_STATE_URL}/${id}`, data);
};

export const delFunnelState = (id: number) => {
  return axios.delete(`${FUNNEL_STATE_URL}/${id}`);
};
