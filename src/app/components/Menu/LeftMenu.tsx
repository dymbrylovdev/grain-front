import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Collapse, Divider, makeStyles, MenuItem } from "@material-ui/core";
import { IntlShape } from "react-intl";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import SpaIcon from "@material-ui/icons/Spa";
import { IUser } from "../../interfaces/users";
import { ICropParam } from "../../interfaces/crops"; // ! imported
import { accessByRoles } from "../../utils/utils";
import { salePurchaseModeForMyBids } from "./utils";
import { ActionWithPayload } from "../../utils/action-helper";
import DealsFilterForAll from "./components/DealsFilterForAll";
import DealsFilterForAdm from "./components/DealsFilterForAdm";

import FilterBids from "./components/FilterBids";

const useStyles = makeStyles(theme => ({
  root: {
    width: 265,
    padding: theme.spacing(1),
  },
  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    fontWeight: "bold",
    padding: "0 16px",
  },
  selected: {
    color: "#5d78ff",
    // fontWeight: "bold",
  },
  btns: {
    display: "flex",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    cursor: "pointer",
  },
  menu_btn_text: {
    marginLeft: theme.spacing(1),
  },
  profile_btn_text: {
    marginRight: theme.spacing(1),
  },
  info: {
    display: "flex",
    flexDirection: "row",
    padding: "6px 16px",
    fontSize: 14,
  },
  nester: {
    justifyContent: "space-between",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  nester_nested: {
    paddingLeft: theme.spacing(4),
    justifyContent: "space-between",
  },
  nested_nested: {
    paddingLeft: theme.spacing(8),
  },
}));

interface IProps {
  intl: IntlShape;
  me: IUser;
  bestAllMyDealsMode?: "deals" | "best-bids" | "all-bids" | "my-bids";
  cropId?: string;
  salePurchaseMode: "sale" | "purchase" | undefined;
  setSalePurchaseMode: (
    salePurchaseMode: "sale" | "purchase" | undefined
  ) => ActionWithPayload<
    "leftMenu/SET_SALE_PURCHASE_MODE",
    {
      salePurchaseMode: "sale" | "purchase" | undefined;
    }
  >;
  setLeftMenuOpen: (
    leftMenuOpen: boolean
  ) => ActionWithPayload<
    "leftMenu/SET_LEFT_MENU_OPEN",
    {
      leftMenuOpen: boolean;
    }
  >;
  enumParams: any;
}

const LeftMenu: React.FC<IProps> = ({
  intl,
  me,
  bestAllMyDealsMode,
  cropId,
  salePurchaseMode,
  setSalePurchaseMode,
  setLeftMenuOpen,
  enumParams,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const [bestOpen, setBestOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false); // ! Changed
  const [allOpen, setAllOpen] = useState(false);

  useEffect(() => {
    if (!salePurchaseMode) {
      if (accessByRoles(me, ["ROLE_VENDOR"])) {
        setSalePurchaseMode("purchase");
      } else {
        setSalePurchaseMode("sale");
      }
    }
  }, [me, salePurchaseMode, setSalePurchaseMode]);

  const handleClick = (url: string | null) => {
    if (url) {
      history.push(url);
    }
    setLeftMenuOpen(false);
  };

  return (
    <div>
      <div className={classes.title}>
        <SpaIcon style={{ marginRight: 8, width: 20, height: 20 }} color="inherit" />
        <div>{intl.formatMessage({ id: "MENU.GRAIN" })}</div>
      </div>

      <Divider style={{ margin: "6px 0" }} />

      {!!bestAllMyDealsMode &&
        bestAllMyDealsMode !== "deals" &&
        accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) && (
          <MenuItem
            className={salePurchaseMode === "sale" ? classes.selected : ""}
            onClick={() => {
              setSalePurchaseMode("sale");
              if (bestAllMyDealsMode) {
                handleClick(
                  `/sale/${bestAllMyDealsMode}${
                    ["best-bids", "all-bids"].includes(bestAllMyDealsMode) ? "/" + cropId : ""
                  }`
                );
              }
            }}
          >
            • {intl.formatMessage({ id: "DEALS.TABLE.SALE" })}
          </MenuItem>
        )}
      {!!bestAllMyDealsMode &&
        bestAllMyDealsMode !== "deals" &&
        accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) && (
          <MenuItem
            className={salePurchaseMode === "purchase" ? classes.selected : ""}
            onClick={() => {
              setSalePurchaseMode("purchase");
              if (bestAllMyDealsMode) {
                handleClick(
                  `/purchase/${bestAllMyDealsMode}${
                    ["best-bids", "all-bids"].includes(bestAllMyDealsMode) ? "/" + cropId : ""
                  }`
                );
              }
            }}
          >
            • {intl.formatMessage({ id: "DEALS.TABLE.PURCHASE" })}
          </MenuItem>
        )}
      {!!bestAllMyDealsMode &&
        bestAllMyDealsMode !== "deals" &&
        accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) && (
          <Divider style={{ margin: "6px 0" }} />
        )}

      <MenuItem
        onClick={() => {
          setAllOpen(false);
          setBestOpen(!bestOpen);
        }}
        className={`${classes.nester} ${
          bestAllMyDealsMode === "best-bids" ? classes.selected : ""
        }`}
      >
        {intl.formatMessage({ id: "SUBMENU.BIDS.BEST" })}
        {bestOpen ? (
          <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
        ) : (
          <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
        )}
      </MenuItem>
      <Collapse in={bestOpen} timeout="auto" unmountOnExit>
        {me?.crops?.map(crop => (
          <MenuItem
            key={crop.id}
            onClick={() => handleClick(`/${salePurchaseMode}/best-bids/${crop.id}`)}
            className={`${classes.nested} ${
              bestAllMyDealsMode === "best-bids" && !!cropId && +cropId === crop.id
                ? classes.selected
                : ""
            }`}
          >
            • {crop.name}
          </MenuItem>
        ))}
        <MenuItem onClick={() => handleClick("/user/profile/crops")} className={classes.nested}>
          • {intl.formatMessage({ id: "SUBMENU.PROFILE.CROPS" })}
        </MenuItem>
      </Collapse>

      <MenuItem
        className={bestAllMyDealsMode === "my-bids" ? classes.selected : ""}
        onClick={() => {
          setBestOpen(false);
          setAllOpen(false);
          handleClick(`/${salePurchaseModeForMyBids(me, salePurchaseMode)}/my-bids`);
        }}
      >
        {intl.formatMessage({ id: "SUBMENU.MY_BIDS" })}
      </MenuItem>

      {accessByRoles(me, ["ROLE_ADMIN"]) && (
        <MenuItem
          onClick={() => {
            setBestOpen(false);
            setAllOpen(!allOpen);
          }}
          className={`${classes.nester} ${
            bestAllMyDealsMode === "all-bids" ? classes.selected : ""
          }`}
        >
          {intl.formatMessage({ id: "SUBMENU.ALL_BIDS" })}
          {allOpen ? (
            <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
          ) : (
            <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
          )}
        </MenuItem>
      )}
      {accessByRoles(me, ["ROLE_ADMIN"]) && (
        <Collapse in={allOpen} timeout="auto" unmountOnExit>
          {me.crops.map(crop => (
            <MenuItem
              key={crop.id}
              onClick={() => handleClick(`/${salePurchaseMode}/all-bids/${crop.id}`)}
              className={`${classes.nested} ${
                bestAllMyDealsMode === "all-bids" && !!cropId && +cropId === crop.id
                  ? classes.selected
                  : ""
              }`}
            >
              • {crop.name}
            </MenuItem>
          ))}
          <MenuItem onClick={() => handleClick("/user/profile/crops")} className={classes.nested}>
            • {intl.formatMessage({ id: "SUBMENU.PROFILE.CROPS" })}
          </MenuItem>
        </Collapse>
      )}

      {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) && (
        <Divider style={{ margin: "6px 0" }} />
      )}

      {/* // ! Changed */}

      {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) &&
        bestAllMyDealsMode === "best-bids" && (
          <MenuItem
            onClick={() => {
              setBestOpen(false);
              setAllOpen(false);
              setFiltersOpen(!filtersOpen);
            }}
            className={`${classes.nester}`}
          >
            {intl.formatMessage({ id: "SUBMENU.FILTERS" })}
            {filtersOpen ? (
              <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
            ) : (
              <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
            )}
          </MenuItem>
        )}
      <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
        <FilterBids />
      </Collapse>

      {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) &&
        bestAllMyDealsMode === "best-bids" && <Divider style={{ margin: "6px 0" }} />}

      {/* // ! Changed */}

      {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) && (
        <MenuItem
          className={bestAllMyDealsMode === "deals" ? classes.selected : ""}
          onClick={() => {
            setBestOpen(false);
            setAllOpen(false);
            setFiltersOpen(false);
            handleClick("/deals");
          }}
        >
          {intl.formatMessage({ id: "SUBMENU.BIDS.DEALS" })}
        </MenuItem>
      )}

      {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) && (
        <Divider style={{ margin: "6px 0" }} />
      )}

      {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) &&
        bestAllMyDealsMode === "deals" && <DealsFilterForAll />}

      {accessByRoles(me, ["ROLE_ADMIN"]) && bestAllMyDealsMode === "deals" && <DealsFilterForAdm />}
    </div>
  );
};

export default LeftMenu;
