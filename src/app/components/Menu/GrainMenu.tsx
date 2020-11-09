import React from "react";
import { connect, ConnectedProps, shallowEqual, useSelector } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Paper, useMediaQuery, makeStyles, Drawer } from "@material-ui/core";

import { leftMenuActions } from "../../store/ducks/leftMenu.duck";

import { IAppState } from "../../store/rootDuck";
import { LeftMenu } from ".";
import { RouteComponentProps, useLocation } from "react-router-dom";
import MyFilters from "../../pages/home/bids/components/filter/MyFilters";

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
}) => {
  const { me, leftMenuOpen, salePurchaseMode } = useSelector(
    ({ auth, leftMenu }: IAppState) => ({
      me: auth.user,
      leftMenuOpen: leftMenu.leftMenuOpen,
      salePurchaseMode: leftMenu.salePurchaseMode,
    }),
    shallowEqual
  );

  const classes = useStyles();

  const matches = useMediaQuery("(min-width:1025px)");

  const location = useLocation();

  let bestAllMyDealsMode: "deals" | "best-bids" | "all-bids" | "my-bids" | undefined = undefined;
  let cropId: string | undefined = undefined;

  if (location.pathname === "/deals") {
    bestAllMyDealsMode = "deals";
  }
  if (location.pathname.split("/")?.[2]) {
    if (location.pathname.split("/")?.[2] === "best-bids") bestAllMyDealsMode = "best-bids";
    cropId = location.pathname.split("/")?.[3];
  }
  if (location.pathname.split("/")?.[2]) {
    if (location.pathname.split("/")?.[2] === "my-bids") bestAllMyDealsMode = "my-bids";
  }
  if (location.pathname.split("/")?.[2]) {
    if (location.pathname.split("/")?.[2] === "all-bids") bestAllMyDealsMode = "all-bids";
    cropId = location.pathname.split("/")?.[3];
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

const connector = connect(null, {
  ...leftMenuActions,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default injectIntl(connector(GrainMenu));
