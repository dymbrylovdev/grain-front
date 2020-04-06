export interface ILocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  country: string;
  province: string;
  city: string;
  street: string;
  text: string;
  house: string;
}

export interface ILocationToRequest {
  name?: string;
  country?: string;
  province?: string;
  city?: string;
  street?: string;
  house?: string;
  text?: string;
  lat?: number;
  lng?: number;
}
