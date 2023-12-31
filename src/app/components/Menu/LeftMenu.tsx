import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Collapse, Divider, makeStyles, MenuItem } from "@material-ui/core";
import { IntlShape } from "react-intl";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import SpaIcon from "@material-ui/icons/Spa";

import { IUser } from "../../interfaces/users";
import { accessByRoles } from "../../utils/utils";
import { salePurchaseModeForMyBids } from "./utils";
import { ActionWithPayload } from "../../utils/action-helper";

import DealsFilterForAll from "./components/DealsFilterForAll";
import DealsFilterForAdm from "./components/DealsFilterForAdm";
import FilterBids from "./components/FilterBids";
import LocationBlockMenu from "./components/LocationBlockMenu";
import FilterByManager from "./components/FilterByManager";
import FilterByDates from "./components/FilterByDates";
import { ICrop } from "../../interfaces/crops";
import Modal from "../ui/Modal";

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
  me?: IUser;
  bestAllMyDealsMode?: "deals" | "best-bids" | "all-bids" | "my-bids" | "edit";
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
  storeCrops?: ICrop[];
}

const LeftMenu: React.FC<IProps> = ({
  intl,
  me,
  bestAllMyDealsMode,
  cropId,
  salePurchaseMode,
  setSalePurchaseMode,
  setLeftMenuOpen,
  storeCrops,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const [bestOpen, setBestOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedBestOpen, setSelectedBestOpen] = useState(bestAllMyDealsMode === "best-bids" || false);
  const [allOpen, setAllOpen] = useState(false);
  const [selectedAllOpen, setSelectedAllOpen] = useState(bestAllMyDealsMode === "all-bids" || false);
  const [mySubscriptionsMode, setMySubscriptionMode] = useState(false);

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

  const userCrops = useMemo(() => (me && me.crops && me.crops.length > 0 ? me?.crops : storeCrops || []), [me, storeCrops]);

  const crops = [
    {
      id: 0,
      name: intl.formatMessage({ id: "SUBMENU.ALL_CROPS" }),
    },
    ...userCrops,
  ];

  const selectedCrop = crops.filter(crop => !!cropId && +cropId === crop.id);

  const location = useLocation().pathname;

  useEffect(() => {
    if (location === "/purchase/filters" || location === "/sale/filters") {
      setMySubscriptionMode(true);
      setSalePurchaseMode(location === "/purchase/filters" ? "purchase" : "sale");
    } else {
      setMySubscriptionMode(false);
    }
  }, [location, setSalePurchaseMode]);

  return (
    <div>
      <div className={classes.title}>
        <SpaIcon style={{ marginRight: 8, width: 20, height: 20 }} color="inherit" />
        <div>{intl.formatMessage({ id: "MENU.GRAIN" })}</div>
      </div>

      <Divider style={{ margin: "6px 0" }} />

      {/* Продажа-Покупка меню */}
      {((!!bestAllMyDealsMode && bestAllMyDealsMode !== "deals" && bestAllMyDealsMode !== "edit") || mySubscriptionsMode) &&
        (accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) || !me) && (
          <>
            <MenuItem
              className={salePurchaseMode === "sale" ? classes.selected : ""}
              onClick={() => {
                setSalePurchaseMode("sale");
                if (bestAllMyDealsMode) {
                  handleClick(`/sale/${bestAllMyDealsMode}${["best-bids", "all-bids"].includes(bestAllMyDealsMode) ? "/" + cropId : ""}`);
                } else if (mySubscriptionsMode) {
                  handleClick("/sale/filters");
                }
              }}
            >
              • {intl.formatMessage({ id: "DEALS.TABLE.SALE" })}
            </MenuItem>
            <MenuItem
              className={salePurchaseMode === "purchase" ? classes.selected : ""}
              onClick={() => {
                setSalePurchaseMode("purchase");
                if (bestAllMyDealsMode) {
                  handleClick(
                    `/purchase/${bestAllMyDealsMode}${["best-bids", "all-bids"].includes(bestAllMyDealsMode) ? "/" + cropId : ""}`
                  );
                } else if (mySubscriptionsMode) {
                  handleClick("/purchase/filters");
                }
              }}
            >
              • {intl.formatMessage({ id: "DEALS.TABLE.PURCHASE" })}
            </MenuItem>
            <Divider style={{ margin: "6px 0" }} />
          </>
        )}

      {/* Покупка продажа для настройки фильтра при создании подписки админом юзеру */}

      {bestAllMyDealsMode === "edit" && accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && (
        <>
          <MenuItem
            className={salePurchaseMode === "sale" ? classes.selected : ""}
            onClick={() => {
              setSalePurchaseMode("sale");
            }}
          >
            • {intl.formatMessage({ id: "DEALS.TABLE.SALE" })}
          </MenuItem>
          <MenuItem
            className={salePurchaseMode === "purchase" ? classes.selected : ""}
            onClick={() => {
              setSalePurchaseMode("purchase");
            }}
          >
            • {intl.formatMessage({ id: "DEALS.TABLE.PURCHASE" })}
          </MenuItem>
          <Divider style={{ margin: "6px 0" }} />
        </>
      )}

      {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && (
        <MenuItem
          className={location === "/user-list" ? classes.selected : ""}
          onClick={() => {
            handleClick(`/user-list`);
          }}
        >
          Список пользователей
        </MenuItem>
      )}

      <MenuItem
        className={mySubscriptionsMode ? classes.selected : ""}
        onClick={() => {
          if (!mySubscriptionsMode && me) {
            handleClick(`/${me?.roles.includes("ROLE_BUYER") ? "sale" : "purchase"}/filters`);
          } else if (!me) {
            setOpen(true);
          }
        }}
      >
        Мои подписки
      </MenuItem>

      <MenuItem
        className={bestAllMyDealsMode === "my-bids" ? classes.selected : ""}
        onClick={() => {
          if (me) {
            setBestOpen(false);
            setAllOpen(false);
            handleClick(`/${salePurchaseModeForMyBids(me, salePurchaseMode)}/my-bids`);
          } else {
            setOpen(true);
          }
        }}
      >
        {intl.formatMessage({ id: "SUBMENU.MY_BIDS" })}
      </MenuItem>

      {accessByRoles(me, ["ROLE_ADMIN"]) && (
        <MenuItem
          onClick={() => {
            setBestOpen(false);
            setAllOpen(!allOpen);
            setSelectedBestOpen(false);
            setSelectedAllOpen(false);
          }}
          className={`${classes.nester} ${bestAllMyDealsMode === "all-bids" ? classes.selected : ""}`}
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
          {crops.map(crop => (
            <MenuItem
              key={crop.id}
              onClick={() => {
                handleClick(`/${salePurchaseMode}/all-bids/${crop.id}`);
                setAllOpen(false);
                setSelectedAllOpen(true);
              }}
              className={`${classes.nested} ${
                bestAllMyDealsMode === "all-bids" && !!cropId && +cropId === crop.id ? classes.selected : ""
              }`}
            >
              • {crop.name}
            </MenuItem>
          ))}
          <MenuItem onClick={() => (me ? handleClick("/user/profile/crops") : setOpen(true))} className={classes.nested}>
            • {intl.formatMessage({ id: "SUBMENU.PROFILE.CROPS" })}
          </MenuItem>
        </Collapse>
      )}

      {accessByRoles(me, ["ROLE_ADMIN"]) && (
        <Collapse in={selectedAllOpen} timeout="auto" unmountOnExit>
          {selectedCrop.map(crop => (
            <MenuItem
              key={crop.id}
              className={`${classes.nested} ${
                bestAllMyDealsMode === "all-bids" && !!cropId && +cropId === crop.id ? classes.selected : ""
              }`}
            >
              • {crop.name}
            </MenuItem>
          ))}
        </Collapse>
      )}

      <MenuItem
        onClick={() => {
          setAllOpen(false);
          setBestOpen(!bestOpen);
          setSelectedBestOpen(false);
          setSelectedAllOpen(false);
        }}
        className={`${classes.nester} ${bestAllMyDealsMode === "best-bids" ? classes.selected : ""}`}
      >
        {intl.formatMessage({ id: "SUBMENU.BIDS.BEST" })}
        {bestOpen ? (
          <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
        ) : (
          <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
        )}
      </MenuItem>

      <Collapse in={bestOpen} timeout="auto" unmountOnExit>
        {me && me.crops && me.crops.length > 0
          ? me.crops.map(crop => (
              <MenuItem
                key={crop.id}
                onClick={() => {
                  handleClick(`/${salePurchaseMode}/best-bids/${crop.id}`);
                  setBestOpen(false);
                  setSelectedBestOpen(true);
                }}
                className={`${classes.nested} ${
                  bestAllMyDealsMode === "best-bids" && !!cropId && +cropId === crop.id ? classes.selected : ""
                }`}
              >
                • {crop.name}
              </MenuItem>
            ))
          : storeCrops &&
            storeCrops.map(crop => (
              <MenuItem
                key={crop.id}
                onClick={() => {
                  handleClick(`/${salePurchaseMode}/best-bids/${crop.id}`);
                  setBestOpen(false);
                  setSelectedBestOpen(true);
                }}
                className={`${classes.nested} ${
                  bestAllMyDealsMode === "best-bids" && !!cropId && +cropId === crop.id ? classes.selected : ""
                }`}
              >
                • {crop.name}
              </MenuItem>
            ))}

        <MenuItem onClick={() => (me ? handleClick("/user/profile/crops") : setOpen(true))} className={classes.nested}>
          • {intl.formatMessage({ id: "SUBMENU.PROFILE.CROPS" })}
        </MenuItem>
      </Collapse>

      <Collapse in={selectedBestOpen} timeout="auto" unmountOnExit>
        {selectedCrop.map(crop => (
          <MenuItem
            key={crop.id}
            className={`${classes.nested} ${bestAllMyDealsMode === "best-bids" && !!cropId && +cropId === crop.id ? classes.selected : ""}`}
          >
            • {crop.name}
          </MenuItem>
        ))}
      </Collapse>

      {(accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) || !me) && <Divider style={{ margin: "6px 0" }} />}

      {bestAllMyDealsMode === "best-bids" && (
        <>
          <LocationBlockMenu me={me} classes={classes} />
          <FilterBids />
        </>
      )}

      {bestAllMyDealsMode === "all-bids" && accessByRoles(me, ["ROLE_ADMIN"]) && (
        <>
          <FilterByManager cropId={cropId} salePurchaseMode={salePurchaseMode} />
          <Divider style={{ margin: "6px 0" }} />
          <FilterByDates />
          <Divider style={{ margin: "6px 0" }} />
        </>
      )}

      {bestAllMyDealsMode === "best-bids" && <Divider style={{ margin: "6px 0" }} />}

      {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) && (
        <MenuItem
          className={bestAllMyDealsMode === "deals" ? classes.selected : ""}
          onClick={() => {
            if (me) {
              setBestOpen(false);
              setAllOpen(false);
              handleClick("/deals");
            } else {
              setOpen(true);
            }
          }}
        >
          {intl.formatMessage({ id: "SUBMENU.BIDS.DEALS" })}
        </MenuItem>
      )}

      {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) && <Divider style={{ margin: "6px 0" }} />}

      {(accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) || !me) && bestAllMyDealsMode === "deals" && <DealsFilterForAll />}

      {accessByRoles(me, ["ROLE_ADMIN"]) && bestAllMyDealsMode === "deals" && <DealsFilterForAdm />}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={"Чтобы продолжить действие с редактированием профиля или объявления, авторизуйтесь!"}
        actions={[
          {
            title: "Cancel",
            onClick: () => setOpen(false),
          },
          {
            title: "OK",
            onClick: () => handleClick("/auth"),
          },
        ]}
      />
    </div>
  );
};

export default LeftMenu;
