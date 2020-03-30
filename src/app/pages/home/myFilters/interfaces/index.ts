export interface IPointPrice {
  point: {
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
  };
  price: number;
}

export interface IMyFiltersParam {
  parameter: {
    id: number;
    name: string;
    type: "enum" | "number";
    enum: string[];
  };
  value: string | string[];
}

export interface IMyFilterItem {
  id: number;
  name: string;
  crop: {
    id: number;
    name: string;
  };
  max_full_price: number;
  max_distance: number;
  parameter_values: IMyFiltersParam[];
  point_prices: IPointPrice[];
}

export interface IParamValue {
  parameter_id: number;
  value: string | string[];
}

export interface IFilterForCreate {
  name: string;
  crop_id: number;
  max_full_price?: number | null;
  max_distance?: number | null;
  parameter_values?: IParamValue[];
  point_prices?: [
    {
      point_id: number;
      price: number;
    }
  ];
}

export interface IFilterParam {
  id: number;
  name: string;
  type: "enum" | "number";
  enum: string[];
}
