import React, { useState, useEffect } from "react";
import { Tabs, Tab, Divider, Theme, Button } from "@material-ui/core";
import { injectIntl, IntlShape, WrappedComponentProps } from "react-intl";
import { makeStyles } from "@material-ui/styles";
import { connect, ConnectedProps } from "react-redux";
import { Skeleton } from "@material-ui/lab";
import { RouteComponentProps, useHistory } from "react-router-dom";

import { TabPanel, a11yProps } from "../../../components/ui/Table/TabPanel";

import CashlessPayment from "./components/TariffForm/components/CashlessPayment";
import PaymentByCard from "./components/TariffForm/components/PaymentByCard";

import { actions as tariffsActions } from "../../../store/ducks/tariffs.duck";
import { actions as authActions } from "../../../store/ducks/auth.duck";
import { actions as trialActions } from "../../../store/ducks/trial.duck";
import { actions as usersActions } from "../../../store/ducks/users.duck";

import { IAppState } from "../../../store/rootDuck";

import { ITariff } from "../../../interfaces/tariffs";
import { IUser } from "../../../interfaces/users";

const useStyles = makeStyles((theme: Theme) => ({
  titleContain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 0,
    paddingLeft: 0,
  },
}));

interface IProps {
  intl: IntlShape;
  me: IUser;
  loadingMe: boolean;
  selectedTariff: ITariff | undefined;
  selectedDate: Date;
  fetchMerchant: any;
  clearSelectedTariff: any;
  fetchMe: any;
  merchant: any;
  trial: any;
}

const PaymentPage: React.FC<IProps &
  TPropsFromRedux &
  WrappedComponentProps &
  RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id },
  },
  intl,
  me,
  match,
  loadingMe,
  selectedTariff,
  selectedDate,
  clearSelectedTariff,
  fetchMerchant,
  fetchMe,
  merchant,
  trial,
  user,
  loadingUser,
  errorUser,
  fetchUser,
}) => {
  const innerClasses = useStyles();
  const history = useHistory();

  let editMode: "profile" | "create" | "edit" | "view" = "create";
  if (match.url.indexOf("profile") !== -1) editMode = "profile";
  if (match.url.indexOf("create") !== -1) editMode = "create";
  if (match.url.indexOf("edit") !== -1) editMode = "edit";
  if (match.url.indexOf("view") !== -1) editMode = "view";

  let realUser: IUser | undefined = undefined;
  if (editMode === "profile" && me) realUser = me;
  if ((editMode === "edit" || editMode === "view") && user) realUser = user;
  if (user) realUser = user;

  const [valueTabs, setValueTabs] = useState(0);

  const handleTabsChange = (e: any, newValue: number) => {
    setValueTabs(newValue);
  };

  console.log(editMode);
  console.log(id);
  console.log("USER", user);

  useEffect(() => {
    if (!selectedTariff || !selectedDate) history.push("/user/profile");
  }, [history, selectedDate, selectedTariff]);

  useEffect(() => {
    fetchMerchant();
  }, [fetchMerchant]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    me && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0])
      ? fetchUser({ id: +id })
      : console.log("123");
  }, [fetchUser, id, me]);

  useEffect(() => {
    return () => {
      clearSelectedTariff();
    };
  }, [clearSelectedTariff]);

  if (!me || loadingMe) return <Skeleton width="100%" height={68} animation="wave" />;

  return (
    <>
      <Button onClick={() => history.goBack()} variant="outlined" color="primary">
        {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
      </Button>
      <div className={innerClasses.titleContain}>
        <Tabs
          value={valueTabs}
          onChange={handleTabsChange}
          variant="scrollable"
          indicatorColor="primary"
          textColor="primary"
          aria-label="tabs"
        >
          <Tab label={intl.formatMessage({ id: "TARIFFS.PAYMENT.TAB1" })} {...a11yProps(0)} />
          {me && !["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0]) && (
            <Tab label={intl.formatMessage({ id: "TARIFFS.PAYMENT.TAB2" })} {...a11yProps(1)} />
          )}
        </Tabs>
      </div>

      <Divider />

      <TabPanel value={valueTabs} index={0}>
        <CashlessPayment
          realUser={realUser}
          selectedTariff={selectedTariff}
          selectedDate={selectedDate}
        />
      </TabPanel>

      {me && !["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0]) && (
        <TabPanel value={valueTabs} index={1}>
          <PaymentByCard
            realUser={realUser}
            selectedTariff={selectedTariff}
            selectedDate={selectedDate}
            merchant={merchant}
            trial={trial}
          />
        </TabPanel>
      )}
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    loadingMe: state.auth.loading,
    errorMe: state.auth.error,

    merchant: state.tariffs.merchant_id,
    selectedTariff: state.tariffs.selectedTariff,
    selectedDate: state.tariffs.selectedDate,

    trial: state.trial.trial,
    trialLoading: state.trial.loading,
    trialSuccess: state.trial.success,
    trialError: state.trial.error,

    user: state.users.user,
    loadingUser: state.users.byIdLoading,
    errorUser: state.users.byIdError,
  }),
  {
    fetchMe: authActions.fetchRequest,
    fetchMerchant: tariffsActions.clearFondyCredentials,
    fetchTrial: trialActions.fetchRequest,
    clearSelectedTariff: tariffsActions.clearSelectedTariff,
    fetchUser: usersActions.fetchByIdRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

// @ts-ignore
export default connector(injectIntl(PaymentPage));
