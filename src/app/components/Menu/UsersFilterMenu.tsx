import React, { ReactElement } from "react";
import { TextField, MenuItem } from "@material-ui/core";
import { IntlShape } from "react-intl";
import { ActionWithPayload } from "../../utils/action-helper";

import { IFunnelState } from "../../interfaces/funnelStates";
import { ITariffType } from "../../interfaces/tariffs";

interface IUsersFilterMenu {
  intl: IntlShape;
  currentFunnelState: string | undefined;
  funnelStates: IFunnelState[] | undefined;
  setFunnelState: (payload: string) => ActionWithPayload<"funnelStates/SET_FUNNEL_STATE", string>;
  tariffsTypes: ITariffType[] | undefined;
  usersFilterTariff: string;
  setUsersFilterTariff: (payload: string) => ActionWithPayload<"tariffs/USERS_FILTER_SET_TARIFF", string>;
  userRoles: any[] | undefined;
  setCurrentRoles: (payload: any) => ActionWithPayload<"users/SET_CURRENT_ROLES", any>;
  currentRoles: string | undefined;
}

const UsersFilterMenu: React.FC<IUsersFilterMenu> = ({
  intl,
  currentFunnelState,
  funnelStates,
  setFunnelState,

  tariffsTypes,
  usersFilterTariff,
  setUsersFilterTariff,
  userRoles,
  setCurrentRoles,
  currentRoles
}): ReactElement => {

  return (
    <div>
      <TextField
        select
        margin="normal"
        label={intl.formatMessage({ id: "SUBMENU.USER.FILTERS_ROLE" })}
        value={currentRoles}
        onChange={e => setCurrentRoles(e.target.value)}
        name="roles"
        variant="outlined"
      >
        <MenuItem value={"Все"}>
            Все
          </MenuItem>
        {userRoles && userRoles.map((userRole) => (
          <MenuItem key={userRole.id} value={userRole.name}>
            {userRole.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        margin="normal"
        label={intl.formatMessage({ id: "SUBMENU.USER.FILTERS_TARIFF" })}
        value={usersFilterTariff}
        onChange={e => setUsersFilterTariff(e.target.value)}
        name="tariff"
        variant="outlined"
      >
        <MenuItem value={"Все"}>
            Все
          </MenuItem>
        {tariffsTypes && tariffsTypes.map((tariffType) => (
          <MenuItem key={tariffType.id} value={tariffType.id}>
            {tariffType.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        margin="normal"
        label={intl.formatMessage({ id: "SUBMENU.USER.FILTERS_STATUS" })}
        value={currentFunnelState}
        onChange={e => setFunnelState(e.target.value)}
        name="status"
        variant="outlined"
      >
        <MenuItem value={"Все"}>
          Все
        </MenuItem>
        {funnelStates &&
          funnelStates.map((funnelState, index) => (
            <MenuItem key={`${funnelState.id}+${index}`} value={funnelState.id}>
              {funnelState.name}
            </MenuItem>
          ))}
      </TextField>

    </div>
  );
};

export default UsersFilterMenu;
