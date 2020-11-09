import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Paper, useMediaQuery, makeStyles, Drawer } from "@material-ui/core";

import { leftMenuActions } from "../../store/ducks/leftMenu.duck";

import { IAppState } from "../../store/rootDuck";
import { LeftMenu } from ".";
import { useLocation } from "react-router-dom";

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

const GrainMenu: React.FC<PropsFromRedux & WrappedComponentProps> = ({
  intl,
  setLeftMenuOpen,
  setSalePurchaseMode,
  me,
  leftMenuOpen,
  salePurchaseMode,
}) => {
  const classes = useStyles();
  const matches = useMediaQuery("(min-width:1025px)");
  const location = useLocation();

  let bestAllMyDealsMode: "deals" | "best-bids" | "all-bids" | "my-bids" | undefined = undefined;

  const [, route, cropId] = location.pathname.split("/");
  if (location.pathname === "/deals") {
    bestAllMyDealsMode = "deals";
  } else if (route) {
    if (route === "best-bids") bestAllMyDealsMode = "best-bids";
    if (route === "my-bids") bestAllMyDealsMode = "my-bids";
    if (route === "all-bids") bestAllMyDealsMode = "all-bids";
  }

  return (
    <>
      {!!matches && !!me && (
        <Paper className={classes.root}>
          <LeftMenu
            intl={intl}
            me={me}
            bestAllMyDealsMode={bestAllMyDealsMode}
            cropId={cropId}
            salePurchaseMode={salePurchaseMode}
            setSalePurchaseMode={setSalePurchaseMode}
            setLeftMenuOpen={setLeftMenuOpen}
          />
        </Paper>
      )}
      {!matches && !!me && (
        <Drawer anchor="left" open={leftMenuOpen} onClose={() => setLeftMenuOpen(false)}>
          <div className={classes.left_menu}>
            <LeftMenu
              intl={intl}
              me={me}
              bestAllMyDealsMode={bestAllMyDealsMode}
              cropId={cropId}
              salePurchaseMode={salePurchaseMode}
              setSalePurchaseMode={setSalePurchaseMode}
              setLeftMenuOpen={setLeftMenuOpen}
            />
          </div>
        </Drawer>
      )}
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    leftMenuOpen: state.leftMenu.leftMenuOpen,
    salePurchaseMode: state.leftMenu.salePurchaseMode,
  }),
  { ...leftMenuActions }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default injectIntl(connector(GrainMenu));
