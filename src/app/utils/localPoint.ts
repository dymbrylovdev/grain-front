import { ILocation } from "../interfaces/locations";

const defaultPoint: ILocation = {
  active: true,
  city: "Краснодар",
  country: "Россия",
  house: "",
  id: 402,
  lat: 45.03547,
  lng: 38.975313,
  name: "Россия, Краснодар",
  province: "Южный федеральный округ",
  street: "",
  text: "Россия, Краснодар",
};

export const getPoint = () => {
  const localPoint = localStorage.getItem("localPoint");
  const parsePoint: ILocation | null = localPoint ? JSON.parse(localPoint) : null;
  if (!parsePoint) {
    return defaultPoint;
  }
  return parsePoint;
};

export const changeActive = (value: ILocation) => {
  localStorage.setItem("localPoint", JSON.stringify(value));
};

export const changePoint = (value: ILocation) => {
  localStorage.setItem("localPoint", JSON.stringify(value));
};
