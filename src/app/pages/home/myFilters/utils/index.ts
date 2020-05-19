import isEqual from "lodash.isequal";
import {
  IFilterForCreate,
  IFilterParam,
  IMyFilterItem,
  IPointPriceForEdit,
  IFilterForBids,
} from "../../../../interfaces/filters";

export const filterForCreate = (
  data: {
    [x: string]: any;
  },
  enumParams: IFilterParam[],
  numberParams: IFilterParam[]
): IFilterForCreate => {
  const filter: IFilterForCreate = {
    name: data.name,
    cropId: +data.cropId,
    max_full_price: +data.max_full_price || 0,
    min_full_price: +data.min_full_price || 0,
    max_distance: +data.max_destination || 0,
    subscribed: data.subscribed,
    point_prices: data.point_prices,
    bid_type: data.bid_type,
  };
  const parameter_values: {
    parameter_id: number;
    value: string | string[];
  }[] = [];
  enumParams &&
    enumParams.forEach(param => {
      const paramValue: {
        parameter_id: number;
        value: string[];
      } = { parameter_id: param.id, value: [] };
      param.enum.forEach((item: string, index) => {
        const valueName = `parameter${param.id}enum${index}`;
        data[valueName] && paramValue.value.push(item);
      });
      paramValue.value.length > 0 && parameter_values.push(paramValue);
    });
  numberParams &&
    numberParams.forEach(param => {
      const valueName = `number${param.id}`;
      const composeName = `compose${param.id}`;
      if (data[valueName]) {
        const value = `${data[composeName] || "≤"}${data[valueName]}`;
        parameter_values.push({ parameter_id: param.id, value });
      }
    });
  return { ...filter, parameter_values };
};

export const filterForBids = (
  data: {
    [x: string]: any;
  },
  enumParams: IFilterParam[],
  numberParams: IFilterParam[]
): IFilterForBids => {
  let filter: IFilterForBids = {
    filter: {
      cropId: +data.cropId,
      max_full_price: data.max_full_price || 0,
      min_full_price: data.min_full_price || 0,
      max_distance: data.max_destination || 0,
      point_prices: data.point_prices,
    },
  };
  const parameter_values: {
    parameter_id: number;
    value: string | string[];
  }[] = [];
  enumParams &&
    enumParams.forEach(param => {
      const paramValue: {
        parameter_id: number;
        value: string[];
      } = { parameter_id: param.id, value: [] };
      param.enum.forEach((item: string, index) => {
        const valueName = `parameter${param.id}enum${index}`;
        data[valueName] && paramValue.value.push(item);
      });
      paramValue.value.length > 0 && parameter_values.push(paramValue);
    });
  numberParams &&
    numberParams.forEach(param => {
      const valueName = `number${param.id}`;
      const composeName = `compose${param.id}`;
      if (data[valueName]) {
        const value = `${data[composeName] || "≤"}${data[valueName]}`;
        parameter_values.push({ parameter_id: param.id, value });
      }
    });
  filter.filter.parameter_values = parameter_values;
  return filter;
};

// fromApiToFilter из фильтра формата API делает формат понимаемый формой
export const fromApiToFilter = (data: IMyFilterItem): { [x: string]: any } => {
  let newFilter: { [x: string]: any } = {};
  if (data && data.id) newFilter["id"] = data.id;
  if (data && data.name) newFilter["name"] = data.name;
  if (data && data.crop && data.crop.id) newFilter["cropId"] = +data.crop.id;
  if (data && data.max_full_price) newFilter["max_full_price"] = data.max_full_price;
  if (data && data.min_full_price) newFilter["min_full_price"] = data.min_full_price;
  if (data && data.max_distance) newFilter["max_destination"] = data.max_distance;
  if (data && data.parameter_values && data.parameter_values.length) {
    data.parameter_values.forEach(item => {
      if (item.parameter.type === "enum") {
        let values = item.value as string[];
        values.forEach(value => {
          newFilter[
            `parameter${item.parameter.id}enum${item.parameter.enum.indexOf(value)}`
          ] = true;
        });
      }
      if (item.parameter.type === "number") {
        let value = item.value as string;
        newFilter[`number${item.parameter.id}`] = value.substr(1);
        newFilter[`compose${item.parameter.id}`] = value.substr(0, 1);
      }
    });
  }
  if (data) newFilter["subscribed"] = data.subscribed;
  if (data && data.point_prices && data.point_prices.length) {
    let pointPrices: IPointPriceForEdit[] = [];
    data.point_prices.forEach(item => {
      pointPrices.push({ point_id: item.point.id, price: item.price });
    });
    newFilter["point_prices"] = pointPrices;
  }
  return newFilter;
};

// сравнивает текущий фильтр и выставленный перед нажатием применить фильтр
// если фильтр был изменен убирает привязки к id, точкам погрузки, имени, типу и подписке
export const filterForSubmit = (
  oldFilter: { [x: string]: any },
  newFilter: { [x: string]: any },
  cropName: string
): { [x: string]: any } => {
  let oldF = { ...oldFilter };
  let newF = { ...newFilter };
  delete oldF.bid_type;
  delete oldF.id;
  delete oldF.name;
  delete oldF.point_prices;
  delete oldF.subscribed;
  delete newF.bid_type;
  delete newF.id;
  delete newF.name;
  delete newF.point_prices;
  delete newF.subscribed;
  if (isEqual(oldF, newF)) {
    return oldFilter;
  }
  newF.name = cropName;
  return newF;
};
