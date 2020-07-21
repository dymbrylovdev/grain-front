import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router-dom";

import { actions as authActions } from "../../store/ducks/auth.duck";
import { actions as myFiltersActions } from "../../store/ducks/myFilters.duck";
import { actions as prompterActions } from "../../store/ducks/prompter.duck";

import { LayoutSplashScreen } from "../../../_metronic";
import { IAppState } from "../../store/rootDuck";

const Logout: React.FC<TPropsFromRedux> = ({
  logout,
  clearCurrentSaleFilter,
  clearCurrentPurchaseFilter,
  hasAuthToken,
  stopPrompter,
}) => {
  useEffect(() => {
    clearCurrentSaleFilter();
    clearCurrentPurchaseFilter();
    stopPrompter();
    logout();
  }, [clearCurrentPurchaseFilter, clearCurrentSaleFilter, logout, stopPrompter]);

  return hasAuthToken ? <LayoutSplashScreen /> : <Redirect to="/auth" />;
};

const connector = connect(
  (state: IAppState) => ({
    hasAuthToken: Boolean(state.auth.authToken),
  }),
  {
    logout: authActions.logout,
    clearCurrentSaleFilter: myFiltersActions.clearCurrentSaleFilter,
    clearCurrentPurchaseFilter: myFiltersActions.clearCurrentPurchaseFilter,
    stopPrompter: prompterActions.stopPrompter,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Logout);
