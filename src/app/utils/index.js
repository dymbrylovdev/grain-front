export function dataToEntities(data) {
  try {
    return data.GeoObjectCollection.featureMember.map(item => {
      const position = item.GeoObject.Point.pos.split(" ").reverse();

      const address = {
        id: position.join(""),
        name: item.GeoObject.name,
        description: item.GeoObject.description,
        pos: {
          lat: position[0],
          lng: position[1],
        },
      };

      return address;
    });
  } catch (e) {
    return [];
  }
}

export function filterForRequest(data, enumParams, numberParams) {
  const filter = {
    crop_id: data.crop_id,
  };
  if (data.max_full_price) {
    filter.max_full_price = data.max_full_price;
  }
  if (data.max_destination) {
    filter.max_destination = data.max_destination;
  }
  const parameter_values = [];
  enumParams &&
    enumParams.map(param => {
      const paramValue = { parameter_id: param.id, value: [] };
      param.enum.map((item, index) => {
        const valueName = `parameter${param.id}enum${index}`;
        data[valueName] && paramValue.value.push(item);
      });
      paramValue.value.length > 0 && parameter_values.push(paramValue);
    });
  numberParams &&
    numberParams.map(param => {
      const valueName = `number${param.id}`;
      const composeName = `compose${param.id}`;
      if (data[valueName]) {
        const value = `${data[composeName] || "≤"}${data[valueName]}`;
        parameter_values.push({ parameter_id: param.id, value });
      }
    });
  return { ...filter, parameter_values };
}

export function isFilterEmpty(filter, enumParams, numberParams) {
  const requestFilter = filterForRequest(filter, enumParams, numberParams);
  if (
    requestFilter.parameter_values.length > 0 ||
    (filter.max_full_price && filter.max_full_price !== "") ||
    (filter.max_destination && filter.max_destination !== "")
  )
    return false;
  return true;
}
