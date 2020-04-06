export const setMeValues = (values: { [key: string]: any }) => {
  let newValues: { [key: string]: any } = {};
  for (var key in values) {
    if (values[key]) {
      if (key !== "role" && key !== "status") newValues[key] = values[key];
    }
  }
  return newValues;
};

export const setCreateValues = (values: { [key: string]: any }) => {
  let newValues: { [key: string]: any } = {};
  for (var key in values) {
    if (values[key]) {
      if (key === "role") {
        newValues["roles"] = [values[key]];
      } else {
        newValues[key] = values[key];
      }
    }
  }
  return newValues;
};

export const setEditValues = (values: { [key: string]: any }) => {
  let newValues: { [key: string]: any } = {};
  for (var key in values) {
    if (values[key]) {
      if (key === "role") {
        newValues["roles"] = [values[key]];
      } else {
        newValues[key] = values[key];
      }
    }
  }
  return newValues;
};
