export const setMeValues = (values: { [key: string]: any }) => {
  let newValues: { [key: string]: any } = {};
  for (var key in values) {
    if (values[key]) {
      if (key !== "role" && key !== "status") {
        if (key === "fio" || key === "phone") {
          newValues[key] = values[key].toString().trim();
        } else {
          newValues[key] = values[key];
        }
      }
    } else {
      if (key === "fio" || key === "phone") {
        newValues[key] = "";
      }
    }
  }
  newValues.login = values.email;
  newValues.use_vat = values.use_vat;
  return newValues;
};

export const setCreateValues = (values: { [key: string]: any }) => {
  let newValues: { [key: string]: any } = {};
  for (var key in values) {
    if (values[key]) {
      if (key === "role") {
        newValues["roles"] = [values[key]];
      } else {
        if (key === "fio" || key === "phone") {
          newValues[key] = values[key].toString().trim();
        } else {
          newValues[key] = values[key];
        }
      }
    } else {
      if (key === "fio" || key === "phone") {
        newValues[key] = "";
      }
    }
  }
  newValues.login = values.email;
  newValues.use_vat = values.use_vat;
  return newValues;
};

export const setEditValues = (values: { [key: string]: any }) => {
  let newValues: { [key: string]: any } = {};
  for (var key in values) {
    if (values[key]) {
      if (key === "role") {
        newValues["roles"] = [values[key]];
      } else {
        if (key === "fio" || key === "phone") {
          newValues[key] = values[key].toString().trim();
        } else {
          newValues[key] = values[key];
        }
      }
    } else {
      if (key === "fio" || key === "phone") {
        newValues[key] = "";
      }
    }
  }
  newValues.login = values.email;
  return newValues;
};
