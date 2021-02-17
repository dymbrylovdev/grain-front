import React, { useEffect, useState } from "react";
import { MenuItem } from "@material-ui/core";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { IAppState } from "../../../store/rootDuck";
import RadioParamGroup from "../../../pages/home/bids/components/filter/RadioParamGroup";
import { actions as bidsActions } from "../../../store/ducks/bids.duck";
import { TBidType } from "../../../interfaces/bids";
// import { setUser } from "@sentry/browser";

const FilterByManager: React.FC<PropsFromRedux &
  WrappedComponentProps & {
    cropId: string | undefined;
    salePurchaseMode: TBidType | undefined;
  }> = ({ intl, fetch, page, perPage, dateFilter, cropId, salePurchaseMode }) => {
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
  const [value, setValue] = useState("1");

  useEffect(() => {
    if (cropId && salePurchaseMode) {
      fetch(+cropId, salePurchaseMode, page, perPage, dateFilter.minDate, dateFilter.maxDate);
    }
  }, [value]);

  const handleChange = e => {
    console.log(e);
    setValue(e);
  };

  return (
    <div>
      <MenuItem>
        <RadioParamGroup
          name={intl.formatMessage({ id: "BIDLIST.FILTTER.MANAGERS" })}
          data={values}
          value={value}
          handleChange={handleChange}
        />
      </MenuItem>
    </div>
  );
};

const connector = connect(
  (state: IAppState) => ({
    page: state.bids.page,
    perPage: state.bids.per_page,
    dateFilter: state.bids.dateFilter,
  }),
  {
    fetch: bidsActions.fetchRequest,
  }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(FilterByManager));
