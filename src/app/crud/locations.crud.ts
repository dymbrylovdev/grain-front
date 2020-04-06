import axios from "axios";
import { ILocationToRequest } from "../interfaces/locations";

export const LOCATIONS_URL = "/api/point";

export const getLocations = () => {
  return axios.get(`${LOCATIONS_URL}s`);
};

export const createLocation = (data: ILocationToRequest) => {
  return axios.post(LOCATIONS_URL, data);
};

export const editLocation = (id: number, data: ILocationToRequest) => {
  return axios.put(`${LOCATIONS_URL}/${id}`, data);
};

export const delLocation = (id: number) => {
  return axios.delete(`${LOCATIONS_URL}/${id}`);
};
