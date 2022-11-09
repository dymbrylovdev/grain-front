import React, { ReactElement, useState, useEffect } from "react";
import { TextField, MenuItem, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
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
  setUserFiltersEmail: any;
  setUserFiltersPhone: any;
  fetchUserFilters: any;
  clearUserFilters: any;
  userFiltersEmail: string | undefined;
  userFiltersPhone: string | undefined;
  setUserBoughtTariff: any;
  boughtTariff: boolean;
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
  currentRoles,

  setUserFiltersEmail,
  setUserFiltersPhone,
  userFiltersEmail,
  userFiltersPhone,

  clearUserFilters,
  fetchUserFilters,

  boughtTariff,
  setUserBoughtTariff,
}): ReactElement => {
  const [isSearchEmail, setSearchEmail] = useState("phone");

  const handleChange = e => {
    setSearchEmail(e.target.value);
  };

  useEffect(() => {
    if (isSearchEmail === "email" && userFiltersEmail) {
      fetchUserFilters({ email: userFiltersEmail });
    }
    if (isSearchEmail === "phone" && userFiltersPhone) {
      fetchUserFilters({ phone: userFiltersPhone });
    }
  }, [userFiltersPhone, userFiltersEmail, fetchUserFilters, isSearchEmail]);

  return (
    <div>
      <TextField
        select
        margin="normal"
        label={intl.formatMessage({ id: "SUBMENU.USER.FILTERS_ROLE" })}
        value={currentRoles}
        onChange={e => {
          setCurrentRoles(e.target.value);
          setUsersFilterTariff("Все");
          setFunnelState("Все");
        }}
        name="roles"
        variant="outlined"
      >
        <MenuItem value={"Все"}>Все</MenuItem>
        {userRoles &&
          userRoles.map(userRole => (
            <MenuItem key={userRole.id} value={userRole.name}>
              {userRole.label}
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
        disabled={!currentRoles || currentRoles === "Все" || currentRoles === "ROLE_ADMIN" || currentRoles === "ROLE_MANAGER"}
      >
        <MenuItem value={"Все"}>Все</MenuItem>
        {tariffsTypes &&
          tariffsTypes.map(tariffType => (
            <MenuItem key={tariffType.id} value={tariffType.id}>
              {tariffType.name}
            </MenuItem>
          ))}
      </TextField>

      {/*<FormControlLabel
        label="Покупал тариф"
        name="boughtTariff"
        control={<Checkbox checked={boughtTariff} onChange={e => setUserBoughtTariff(!boughtTariff)} />}
      />*/}

      <TextField
        select
        margin="normal"
        label={intl.formatMessage({ id: "SUBMENU.USER.FILTERS_STATUS" })}
        value={currentFunnelState}
        onChange={e => setFunnelState(e.target.value)}
        name="status"
        variant="outlined"
        disabled={!currentRoles || currentRoles === "Все" || currentRoles === "ROLE_ADMIN" || currentRoles === "ROLE_MANAGER"}
      >
        <MenuItem value={"Все"}>Все</MenuItem>
        {funnelStates &&
          funnelStates.map((funnelState, index) => (
            <MenuItem key={`${funnelState.id}+${index}`} value={funnelState.id}>
              {funnelState.name}
            </MenuItem>
          ))}
      </TextField>

      <RadioGroup name="emailSender" value={isSearchEmail} onChange={handleChange}>
        <FormControlLabel value="phone" label="Поиск по телефону" control={<Radio />} />
        <FormControlLabel value="email" label="Поиск по email" control={<Radio />} />
      </RadioGroup>

      {isSearchEmail === "email" ? (
        <TextField
          margin="normal"
          label={intl.formatMessage({ id: "SUBMENU.USER.FILTERS_SEARCH_EMAIL" })}
          value={userFiltersEmail}
          onChange={e => {
            setUserFiltersEmail(e.target.value);
          }}
          name={userFiltersEmail}
          variant="outlined"
        />
      ) : (
        <TextField
          margin="normal"
          label={intl.formatMessage({ id: "SUBMENU.USER.FILTERS_SEARCH_PHONE" })}
          value={userFiltersPhone}
          onChange={e => {
            setUserFiltersPhone(e.target.value);
          }}
          name="searchPhone"
          variant="outlined"
        />
      )}
    </div>
  );
};

export default UsersFilterMenu;
