import axios from "axios";
import { ITariffToRequest } from "../interfaces/tariffs";

export const TARIFF_URL = "/api/tariff";

export const getTariffs = (userView?: number) => {
  return axios.get(`${TARIFF_URL}s${userView ? `?user_view=${userView}` : ""} `);
};

export const editTariff = (id: number, data: ITariffToRequest) => {
  return axios.put(`${TARIFF_URL}/${id}`, data);
};

export const editTariffPeriod = (id: number, data: ITariffToRequest) => {
  return axios.put(`${TARIFF_URL}_period/${id}`, data);
};

export const editTariffLimits = (id: number, data: ITariffToRequest) => {
  return axios.put(`${TARIFF_URL}_limits/${id}`, data);
};

export const getTariffsProlongations = (id: number) => {
  return axios.get(`${TARIFF_URL}_prolongation/${id}`);
};

export const getTariffsTypes = (role?: string) => {
  return axios.get(`${TARIFF_URL}_types${role ? `?role=${role}` : ""}`);
}

export const getFondyCredentials = () => {
  return axios.get("/api/fondy/credentials");
};
