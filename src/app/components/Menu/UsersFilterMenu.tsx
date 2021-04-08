import React, { ReactElement } from "react";
import { FormControlLabel, Checkbox, TextField, Divider, MenuItem } from "@material-ui/core";
import { IntlShape } from "react-intl";
import { ActionWithPayload } from "../../utils/action-helper";

import { IFunnelState } from "../../interfaces/funnelStates";
import { ITariffType } from "../../interfaces/tariffs";
import FitlerByRole from "./components/FilterByRole";

interface IUsersFilterMenu {
  intl: IntlShape;
  funnelStates: IFunnelState[] | undefined;
  tariffsTypes: ITariffType[] | undefined;
  usersFilterTariff: string;
  setUsersFilterTariff: (payload: string) => ActionWithPayload<"users/USERS_FILTER_SET_TARIFF", string>;
}

const UsersFilterMenu: React.FC<IUsersFilterMenu> = ({
  intl,
  funnelStates,
  tariffsTypes,
  usersFilterTariff,
  setUsersFilterTariff,
}): ReactElement => {

  return (
    <div>
      <TextField
        select
        margin="normal"
        label={intl.formatMessage({ id: "SUBMENU.USER.FILTERS.TARIFF" })}
        value={usersFilterTariff}
        onChange={e => setUsersFilterTariff(e.target.value)}
        name="tariff"
        variant="outlined"
      >
        <MenuItem value={"Все"}>
            Все
          </MenuItem>
        {tariffsTypes && tariffsTypes.map((tariffType) => (
          <MenuItem key={tariffType.id} value={tariffType.name}>
            {tariffType.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        margin="normal"
        label={intl.formatMessage({ id: "SUBMENU.USER.FILTERS.STATUS" })}
        value={"vallue"}
        onChange={e => console.log(e.target.value)}
        name="status"
        variant="outlined"
        // helperText={touched.role && errors.role}
        // error={Boolean(touched.role && errors.role)}
        // disabled={editMode !== "create"}
      >
        {funnelStates &&
          funnelStates.map(funnelState => (
            <MenuItem key={funnelState.id} value={funnelState.name}>
              {funnelState.name}
            </MenuItem>
          ))}
      </TextField>

      <Divider style={{ marginTop: 10, marginBottom: 5 }} />

      <FitlerByRole />

      {/* <FormControlLabel
        control={<Checkbox checked={true} onChange={e => console.log(e)} />}
        label={"Только с предоплатой"}
        name="fullPrepayment"
      /> */}
    </div>
  );
};

export default UsersFilterMenu;
