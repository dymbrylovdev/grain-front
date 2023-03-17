export type TAllCropRequest = "number" | "enum" | "all";

export interface ICrop {
  id: number;
  name: string;
  vat: number;
  delivery_price_coefficient?: number;
  delivery_price_overload?: number;
  photo?: {
    id: number;
    path: string;
    main: boolean;
    name: string;
    extension: string;
    mimeType: string;
    small: string;
  };
}

export interface ICropParam {
  id: number;
  name: string;
  type: "enum" | "number";
  enum: string[];
  is_deleted: boolean;
}
