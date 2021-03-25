import React, { ReactElement } from "react";
import { TextField } from "@material-ui/core";
import { IntlShape } from "react-intl";

interface IUserFilterMenu {
  intl: IntlShape;
}

const UsersFilterMenu: React.FC<IUserFilterMenu> = ({ intl, }): ReactElement => {
  return (
    <div>
      <TextField
        select
        margin="normal"
        label={intl.formatMessage({ id: "PROFILE.INPUT.ROLE" })}
        value={"value"}
        onChange={(e) => console.log(e)}
        name="role"
        variant="outlined"
        // helperText={touched.role && errors.role}
        // error={Boolean(touched.role && errors.role)}
        // disabled={editMode !== "create"}
      />
    </div>
  );
};

export default UsersFilterMenu;
