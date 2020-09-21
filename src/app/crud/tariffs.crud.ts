import axios from "axios";
import { ITariffToRequest } from "../interfaces/tariffs";

export const TARIFF_URL = "/api/tariff";

export const getTariffs = () => {
  return axios.get(`${TARIFF_URL}s`);
};

export const editTariff = (id: number, data: ITariffToRequest) => {
  return axios.put(`${TARIFF_URL}/${id}`, data);
};
