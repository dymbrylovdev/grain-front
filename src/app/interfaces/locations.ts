export interface ILocation {
  id?: number;
  name?: string;
  lat: number;
  lng: number;
  country: string;
  province: string;
  city: string;
  street: string;
  text: string;
  house: string;
  active: boolean;
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
  user_id?: number;
  active?: boolean;
}
