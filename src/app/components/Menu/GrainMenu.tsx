import React from "react";
import { useLocation } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Paper, useMediaQuery, makeStyles, Drawer } from "@material-ui/core";

// import { actions as tariffsActions } from "../../store/ducks/tariffs.duck";
import { leftMenuActions } from "../../store/ducks/leftMenu.duck";
import { actions as tariffActions } from "../../store/ducks/tariffs.duck";
import { actions as funnelStatesActions } from "../../store/ducks/funnelStates.duck";
import { actions as usersActions } from "../../store/ducks/users.duck";
import { IAppState } from "../../store/rootDuck";

import { LeftMenu } from ".";
import UsersFilterMenu from "./UsersFilterMenu";
import { accessByRoles } from "../../utils/utils";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flex: "none",
    flexDirection: "column",
    width: 265,
    padding: theme.spacing(2),
    marginRight: theme.spacing(2),
    overflowX: "hidden",
    fontSize: 14,
  },
  left_menu: {
    width: 265,
    padding: theme.spacing(2),
  },
}));

const Wrapper: React.FC<{
  isMinWidthQuery: boolean;
  className: string;
  setCloseDrawer: () => {} | void;
  isMenuOpen: boolean;
}> = ({ isMinWidthQuery, children, className, setCloseDrawer, isMenuOpen }) =>
  isMinWidthQuery ? (
    <Paper className={className}>{children}</Paper>
  ) : (
    <Drawer anchor="left" open={isMenuOpen} onClose={setCloseDrawer}>
      <div className={className}>{children}</div>
    </Drawer>
  );

const GrainMenu: React.FC<PropsFromRedux & WrappedComponentProps> = ({
  intl,
  setLeftMenuOpen,
  setSalePurchaseMode,
  me,
  leftMenuOpen,
  salePurchaseMode,
  cropParams,
  currentFunnelState,
  setFunnelState,
  funnelStates,

  tariffsTypes,
  usersFilterTariff,
  setUsersFilterTariff,
  userRoles,
  setCurrentRoles,
  currentRoles,

  setUserFiltersEmail,
  setUserFiltersPhone,
  clearUserFilters,
  fetchUserFilters,

  userFiltersEmail,
  userFiltersPhone,

  boughtTariff,
  setUserBoughtTariff,
  crops,
}) => {
  const classes = useStyles();
  const isMinWidthQuery = useMediaQuery("(min-width:1025px)");
  const location = useLocation();

  let bestAllMyDealsMode: "deals" | "best-bids" | "all-bids" | "my-bids" | undefined = undefined;

  const [, , route, cropId] = location.pathname.split("/");
  if (location.pathname === "/deals") {
    bestAllMyDealsMode = "deals";
  } else if (route) {
    if (route === "best-bids") bestAllMyDealsMode = "best-bids";
    if (route === "my-bids") bestAllMyDealsMode = "my-bids";
    if (route === "all-bids") bestAllMyDealsMode = "all-bids";
  }

  // if (!me) return null;
  if (accessByRoles(me, ["ROLE_TRANSPORTER"])) return null;

  return (
    <Wrapper
      isMinWidthQuery={isMinWidthQuery}
      className={isMinWidthQuery ? classes.root : classes.left_menu}
      isMenuOpen={leftMenuOpen}
      setCloseDrawer={() => setLeftMenuOpen(false)}
    >
      <LeftMenu
        intl={intl}
        me={me}
        bestAllMyDealsMode={bestAllMyDealsMode}
        cropId={cropId}
        salePurchaseMode={salePurchaseMode}
        setSalePurchaseMode={setSalePurchaseMode}
        setLeftMenuOpen={setLeftMenuOpen}
        enumParams={cropParams && cropParams.filter(item => item.type === "enum")}
        storeCrops={crops}
      />

      {location.pathname === "/user-list" && (
        <UsersFilterMenu
          intl={intl}
          currentFunnelState={currentFunnelState}
          funnelStates={funnelStates}
          setFunnelState={setFunnelState}
          tariffsTypes={tariffsTypes}
          usersFilterTariff={usersFilterTariff}
          setUsersFilterTariff={setUsersFilterTariff}
          userRoles={userRoles}
          setCurrentRoles={setCurrentRoles}
          currentRoles={currentRoles}
          setUserFiltersEmail={setUserFiltersEmail}
          setUserFiltersPhone={setUserFiltersPhone}
          fetchUserFilters={fetchUserFilters}
          clearUserFilters={clearUserFilters}
          userFiltersEmail={userFiltersEmail}
          userFiltersPhone={userFiltersPhone}
          boughtTariff={boughtTariff}
          setUserBoughtTariff={setUserBoughtTariff}
        />
      )}
    </Wrapper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    leftMenuOpen: state.leftMenu.leftMenuOpen,
    salePurchaseMode: state.leftMenu.salePurchaseMode,
    cropParams: state.crops2.cropParams,
    currentFunnelState: state.funnelStates.currentFunnelState,
    funnelStates: state.funnelStates.funnelStates,
    tariffsTypes: state.tariffs.tariffsTypes,
    usersFilterTariff: state.tariffs.usersFilterTariff,
    userRoles: state.users.roles,
    userFiltersEmail: state.users.userFiltersEmail,
    userFiltersPhone: state.users.userFiltersPhone,
    currentRoles: state.users.currentRoles,
    boughtTariff: state.users.boughtTariff,
    crops: state.crops2.crops,
  }),
  {
    ...leftMenuActions,
    setUsersFilterTariff: tariffActions.setUsersFilterTariff,
    setFunnelState: funnelStatesActions.setFunnelState,
    setCurrentRoles: usersActions.setCurrentRoles,

    setUserFiltersEmail: usersActions.setUserFiltersEmail,
    setUserFiltersPhone: usersActions.setUserFiltersPhone,

    clearUserFilters: usersActions.clearUserFilters,
    fetchUserFilters: usersActions.userFiltersRequest,

    setUserBoughtTariff: usersActions.setUserBoughtTariff,
  }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default injectIntl(connector(GrainMenu));
