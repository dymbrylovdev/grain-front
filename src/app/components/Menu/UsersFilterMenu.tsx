import React, { ReactElement } from "react";
import { TextField } from "@material-ui/core";
import { IntlShape } from "react-intl";

interface IUserFilterMenu {
  intl: IntlShape;
}

const UsersFilterMenu: React.FC<IUserFilterMenu> = ({ intl, }): ReactElement => {
  return (
    <div>
    </div>
  );
};

export default UsersFilterMenu;
