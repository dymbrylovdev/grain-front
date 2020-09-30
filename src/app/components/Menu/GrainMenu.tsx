import React from "react";
import { connect, ConnectedProps, shallowEqual, useSelector } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Paper, useMediaQuery, makeStyles, Drawer } from "@material-ui/core";

import { leftMenuActions } from "../../store/ducks/leftMenu.duck";

import { IAppState } from "../../store/rootDuck";
import { LeftMenu } from ".";

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

interface IProps {
  bestAllMyDealsMode?: "deals" | "best-bids" | "all-bids" | "my-bids";
  cropId?: string;
}

const GrainMenu: React.FC<IProps & PropsFromRedux & WrappedComponentProps> = ({
  intl,
  bestAllMyDealsMode,
  cropId,

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
      {!!me && (
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

const connector = connect(null, { ...leftMenuActions });
type PropsFromRedux = ConnectedProps<typeof connector>;

export default injectIntl(connector(GrainMenu));
