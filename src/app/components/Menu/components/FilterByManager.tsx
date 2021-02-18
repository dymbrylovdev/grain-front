import React, { useEffect, useState } from "react";
import { MenuItem } from "@material-ui/core";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { IAppState } from "../../../store/rootDuck";
import RadioParamGroup from "../../../pages/home/bids/components/filter/RadioParamGroup";
import { actions as bidsActions } from "../../../store/ducks/bids.duck";
import { TBidType } from "../../../interfaces/bids";
import { actions as usersActions } from "../../../store/ducks/users.duck";
import { TRole } from "../../../interfaces/users";
// import { setUser } from "@sentry/browser";

const FilterByManager: React.FC<PropsFromRedux &
  WrappedComponentProps & {
    cropId: string | undefined;
    salePurchaseMode: TBidType | undefined;
  }> = ({ intl, setFilter, filter, fetchUsers, users }) => {
  const values = [
    {
      value: "1",
      label: "Some text",
    },
    {
      value: "2",
      label: "Some text 2",
    },
    {
      value: "3",
      label: "Some text 3",
    },
    {
      value: "4",
      label: "Some text 4",
    },
  ];

  useEffect(() => {
    fetchUsers({ page: 1, perPage: 999, roles: ["ROLE_MANAGER"] });
  }, []);

  const handleChange = e => {
    setFilter({ authorLogin: e });
  };

  const data = [
    {
      value: "",
      label: "Все авторы объявлений",
    },
    ...(users?.map(user => ({ label: user.login, value: user.login })) || []),
  ];

  return (
    <div>
      <MenuItem>
        <RadioParamGroup
          name={intl.formatMessage({ id: "BIDLIST.FILTTER.MANAGERS" })}
          data={data}
          value={filter.authorLogin}
          handleChange={handleChange}
        />
      </MenuItem>
    </div>
  );
};

const connector = connect(
  (state: IAppState) => ({
    filter: state.bids.filter,
    users: state.users.users,
  }),
  {
    setFilter: bidsActions.setFilter,
    fetchUsers: usersActions.fetchRequest,
  }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(FilterByManager));
