export type TAllCropRequest = "number" | "enum" | "all";

export interface ICrop {
  id: number;
  name: string;
  vat: number;
}

export interface ICropParam {
  id: number;
  name: string;
  type: "enum" | "number";
  enum: string[];
}
