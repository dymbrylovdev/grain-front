import axios from "axios";
import { ITrialToRequest } from "../interfaces/trial";

export const TRIAL_URL = "/api/tariff";

export const getTrial = () => {
  return axios.get(`${TRIAL_URL}s`);
};

export const editTrial = (id: number, data: ITrialToRequest) => {
  return axios.put(`${TRIAL_URL}/${id}`, data);
};
