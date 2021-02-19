import React, { useEffect } from "react";
import { MenuItem } from "@material-ui/core";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { IAppState } from "../../../store/rootDuck";
import RadioParamGroup from "../../../pages/home/bids/components/filter/RadioParamGroup";
import { actions as bidsActions } from "../../../store/ducks/bids.duck";
import { TBidType } from "../../../interfaces/bids";
import { actions as usersActions } from "../../../store/ducks/users.duck";
// import { setUser } from "@sentry/browser";

const FilterByManager: React.FC<PropsFromRedux &
  WrappedComponentProps & {
    cropId: string | undefined;
    salePurchaseMode: TBidType | undefined;
  }> = ({ intl, setFilter, filter, fetchUsers, users, clearFetch }) => {
  useEffect(() => {
    fetchUsers({ page: 1, perPage: 999, roles: ["ROLE_MANAGER"] });

    return () => {
      clearFetch();
    };
  }, []);

  const handleChange = e => {
    setFilter({ authorId: e });
  };

  const data = [
    {
      value: "",
      label: "Все авторы объявлений",
    },
    ...(users?.map(user => ({
      label: user.login || user.phone?.toString() || "",
      value: user.id.toString(),
    })) || []),
  ];

  return (
    <div>
      <MenuItem>
        <RadioParamGroup
          name={intl.formatMessage({ id: "BIDLIST.FILTTER.MANAGERS" })}
          data={data}
          value={filter.authorId}
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
    clearFetch: usersActions.clearFetch,
  }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(FilterByManager));
