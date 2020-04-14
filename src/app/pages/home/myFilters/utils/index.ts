import { IFilterForCreate, IFilterParam, IMyFilterItem } from "../../../../interfaces/filters";

export const filterForCreate = (
  data: {
    [x: string]: any;
  },
  enumParams: IFilterParam[],
  numberParams: IFilterParam[]
): IFilterForCreate => {
  const filter: IFilterForCreate = {
    name: data.name,
    crop_id: data.crop_id,
    max_full_price: data.max_full_price || 0,
    max_distance: data.max_destination || 0,
    subscribed: data.subscribed,
    point_prices: data.point_prices,
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

// fromApiToFilter из фильтра формата API делает формат понимаемый формой
export const fromApiToFilter = (data: IMyFilterItem): { [x: string]: any } => {
  let newFilter: { [x: string]: any } = {};
  if (data && data.name) newFilter["name"] = data.name;
  if (data && data.crop && data.crop.id) newFilter["crop_id"] = data.crop.id;
  if (data && data.max_full_price) newFilter["max_full_price"] = data.max_full_price;
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

  return newFilter;
};
