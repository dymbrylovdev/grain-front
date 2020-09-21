import axios from "axios";
import { ITrialToRequest } from "../interfaces/trial";

export const TRIAL_URL = "/api/system/settings";

export const getTrial = () => {
  return axios.get(`${TRIAL_URL}`);
};

export const editTrial = (data: ITrialToRequest) => {
  return axios.post(`${TRIAL_URL}`, data);
};
