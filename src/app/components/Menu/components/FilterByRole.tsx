import React, { ReactElement, useState } from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import { useFormik } from "formik";

import { ActionWithPayload } from "../../../utils/action-helper";

interface IFilterByRole {
  userRoles: any[] | undefined;
  setCurrentRoles: (payload: any) => ActionWithPayload<"users/SET_CURRENT_ROLES", any>;
}

const FilterByRole: React.FC<IFilterByRole> = ({ userRoles, setCurrentRoles }): ReactElement => {
  const roleLabels = [
    {
      id: 1,
      label: "Администратор"
    },
    {
      id: 2,
      label: "Покупатель"
    },
    {
      id: 3,
      label: "Продавец"
    },
    {
      id: 4,
      label: "Трейдер"
    },
    {
      id: 5,
      label: "Менеджер"
    }
  ];

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      let params: any[] = [];

      for (const [key, value] of Object.entries(values)) {
        if (value) {
          params.push({ key: key, value: value })
        }
      }

      console.log('params', params);
      
      setCurrentRoles(params);
    },
  });

  return (
    <div>
      {roleLabels &&
        roleLabels.map(role => {
          const valueName = role.label
          return (
            <FormControlLabel
              key={role.id}
              control={
                <Checkbox
                  checked={values[valueName] || false}
                  onChange={e => {
                    handleChange(e);
                    handleSubmit();
                  }}
                />
              }
              label={role.label}
              name={role.label}
            />
          );
        })}
    </div>
  );
};

export default FilterByRole;
