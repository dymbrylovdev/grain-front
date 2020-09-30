import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Collapse,
  Divider,
  makeStyles,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
} from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";
import MenuIcon from "@material-ui/icons/Menu";
import TuneIcon from "@material-ui/icons/Tune";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import PersonPinOutlinedIcon from "@material-ui/icons/PersonPinOutlined";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import { leftMenuActions } from "../../app/store/ducks/leftMenu.duck";

import { IAppState } from "../../app/store/rootDuck";
import { accessByRoles } from "../../app/utils/utils";
import { roles } from "../../app/pages/home/users/utils/profileForm";

const useStyles = makeStyles(theme => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    height: 50,
    width: "100%",
    backgroundColor: "#1e1e2d",
    zIndex: 101,
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

const NewHeader: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  me,
  leftMenuOpen,
  setLeftMenuOpen,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [analiticsOpen, setAnaliticsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [catalogSettingsOpen, setCatalogSettingsOpen] = useState(false);
  const [tariffOpen, setTariffOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  const handleClick = (url: string | null) => {
    if (url) {
      history.push(url);
    }
    setAnchorEl(null);
  };

  const mediaQuerymatches = useMediaQuery("(min-width:1025px)");

  return (
    <div className={classes.root}>
      <div className="kt-container kt-container--fluid">
        <div className={classes.btns}>
          {!mediaQuerymatches ? (
            <div className={classes.btn} onClick={() => setLeftMenuOpen(!leftMenuOpen)}>
              <MenuIcon />
              <div className={classes.menu_btn_text}>{intl.formatMessage({ id: "MENU" })}</div>
            </div>
          ) : (
            <div></div>
          )}
          <div
            className={classes.btn}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <div className={classes.profile_btn_text}>
              {intl.formatMessage({ id: "MENU.SETTINGS" })}
            </div>
            <TuneIcon />
          </div>
        </div>
      </div>
      {!!me && (
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleClick("/user/profile")}>
            <div className={classes.info}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {!!me && !me.company_confirmed_by_payment && !me.company_confirmed_by_email ? (
                  <Tooltip
                    title={intl.formatMessage({
                      id: "COMPANY.CONFIRM.NO_CONFIRM",
                    })}
                  >
                    <ReportProblemIcon
                      color="error"
                      style={{ marginRight: 8, width: 20, height: 20 }}
                    />
                  </Tooltip>
                ) : (
                  <PersonPinOutlinedIcon
                    color="inherit"
                    style={{ marginRight: 8, width: 20, height: 20 }}
                  />
                )}
              </div>
              <div>
                <div style={{ fontWeight: "bold", color: "#000000" }}>{me.email}</div>
                <div style={{ color: "gray" }}>
                  {roles
                    .find(role => !!me?.roles?.length && role.id === me.roles[0])
                    ?.value?.toLowerCase()}
                </div>
              </div>
            </div>
          </MenuItem>

          <Divider style={{ margin: "6px 16px" }} />

          {accessByRoles(me, ["ROLE_BUYER"]) && (
            <MenuItem onClick={() => handleClick("/user/profile")}>
              {intl.formatMessage({ id: "SUBMENU.PROFILE" })}
            </MenuItem>
          )}
          {accessByRoles(me, ["ROLE_BUYER"]) && (
            <MenuItem onClick={() => handleClick("/sale/filters")}>
              {intl.formatMessage({ id: "SUBMENU.MY_FILTERS" })}
            </MenuItem>
          )}

          {accessByRoles(me, ["ROLE_VENDOR"]) && (
            <MenuItem onClick={() => handleClick("/user/profile")}>
              {intl.formatMessage({ id: "SUBMENU.PROFILE" })}
            </MenuItem>
          )}
          {accessByRoles(me, ["ROLE_VENDOR"]) && (
            <MenuItem onClick={() => handleClick("/purchase/filters")}>
              {intl.formatMessage({ id: "SUBMENU.MY_FILTERS" })}
            </MenuItem>
          )}

          {accessByRoles(me, ["ROLE_TRADER"]) && (
            <MenuItem onClick={() => handleClick("/user/profile")}>
              {intl.formatMessage({ id: "SUBMENU.PROFILE" })}
            </MenuItem>
          )}
          {accessByRoles(me, ["ROLE_TRADER"]) && (
            <MenuItem onClick={() => setFiltersOpen(!filtersOpen)} className={classes.nester}>
              {intl.formatMessage({ id: "SUBMENU.MY_FILTERS" })}
              {filtersOpen ? (
                <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
              ) : (
                <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
              )}
            </MenuItem>
          )}
          {accessByRoles(me, ["ROLE_TRADER"]) && (
            <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
              <MenuItem onClick={() => handleClick("/sale/filters")} className={classes.nested}>
                {intl.formatMessage({ id: "SUBMENU.BUYER_FILTERS" })}
              </MenuItem>
              <MenuItem onClick={() => handleClick("/purchase/filters")} className={classes.nested}>
                {intl.formatMessage({ id: "SUBMENU.SELLER_FILTERS" })}
              </MenuItem>
            </Collapse>
          )}

          {accessByRoles(me, ["ROLE_MANAGER", "ROLE_ADMIN"]) && (
            <MenuItem onClick={() => setAnaliticsOpen(!analiticsOpen)} className={classes.nester}>
              {intl.formatMessage({ id: "MENU.ANALITICS" })}
              {analiticsOpen ? (
                <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
              ) : (
                <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
              )}
            </MenuItem>
          )}
          {accessByRoles(me, ["ROLE_MANAGER", "ROLE_ADMIN"]) && (
            <Collapse in={analiticsOpen} timeout="auto" unmountOnExit>
              <MenuItem onClick={() => handleClick("/activity-report")} className={classes.nested}>
                {intl.formatMessage({ id: "SUBMENU.ACTIVITY_REPORT" })}
              </MenuItem>
            </Collapse>
          )}

          {accessByRoles(me, ["ROLE_MANAGER", "ROLE_ADMIN"]) && (
            <MenuItem onClick={() => setUsersOpen(!usersOpen)} className={classes.nester}>
              {intl.formatMessage({ id: "MENU.USERS" })}
              {usersOpen ? (
                <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
              ) : (
                <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
              )}
            </MenuItem>
          )}
          {accessByRoles(me, ["ROLE_MANAGER", "ROLE_ADMIN"]) && (
            <Collapse in={usersOpen} timeout="auto" unmountOnExit>
              <MenuItem onClick={() => handleClick("/user-list")} className={classes.nested}>
                {intl.formatMessage({ id: "SUBMENU.USER.LIST" })}
              </MenuItem>
              <MenuItem onClick={() => handleClick("/user/create")} className={classes.nested}>
                {intl.formatMessage({ id: "SUBMENU.USER.CREATE_USER" })}
              </MenuItem>
              <MenuItem onClick={() => handleClick("/companyList")} className={classes.nested}>
                {intl.formatMessage({ id: "SUBMENU.COMPANY.LIST" })}
              </MenuItem>
              <MenuItem onClick={() => handleClick("/company/create")} className={classes.nested}>
                {intl.formatMessage({ id: "SUBMENU.COMPANY.CREATE" })}
              </MenuItem>
            </Collapse>
          )}

          {accessByRoles(me, ["ROLE_MANAGER", "ROLE_ADMIN"]) && (
            <MenuItem onClick={() => setSettingsOpen(!settingsOpen)} className={classes.nester}>
              {intl.formatMessage({ id: "MENU.SETTINGS" })}
              {settingsOpen ? (
                <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
              ) : (
                <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
              )}
            </MenuItem>
          )}
          {accessByRoles(me, ["ROLE_MANAGER", "ROLE_ADMIN"]) && (
            <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
              <MenuItem onClick={() => handleClick("/user/profile")} className={classes.nested}>
                {intl.formatMessage({ id: "SUBMENU.PROFILE" })}
              </MenuItem>
              <MenuItem
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={classes.nester_nested}
              >
                {intl.formatMessage({ id: "SUBMENU.MY_FILTERS" })}
                {filtersOpen ? (
                  <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
                ) : (
                  <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
                )}
              </MenuItem>
              <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
                <MenuItem
                  onClick={() => handleClick("/sale/filters")}
                  className={classes.nested_nested}
                >
                  {intl.formatMessage({ id: "SUBMENU.BUYER_FILTERS" })}
                </MenuItem>
                <MenuItem
                  onClick={() => handleClick("/purchase/filters")}
                  className={classes.nested_nested}
                >
                  {intl.formatMessage({ id: "SUBMENU.SELLER_FILTERS" })}
                </MenuItem>
              </Collapse>
              {accessByRoles(me, ["ROLE_ADMIN"]) && (
                <MenuItem
                  onClick={() => setCatalogSettingsOpen(!catalogSettingsOpen)}
                  className={classes.nester_nested}
                >
                  {intl.formatMessage({ id: "SUBMENU.CATALOG.SETTINGS" })}
                  {catalogSettingsOpen ? (
                    <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
                  ) : (
                    <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
                  )}
                </MenuItem>
              )}
              {accessByRoles(me, ["ROLE_ADMIN"]) && (
                <Collapse in={catalogSettingsOpen} timeout="auto" unmountOnExit>
                  <MenuItem
                    onClick={() => handleClick("/cropList")}
                    className={classes.nested_nested}
                  >
                    {intl.formatMessage({ id: "SUBMENU.CATALOG.CROP_LIST" })}
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleClick("/crop/create")}
                    className={classes.nested_nested}
                  >
                    {intl.formatMessage({ id: "SUBMENU.CATALOG.CREATE_CROP" })}
                  </MenuItem>
                </Collapse>
              )}
              {accessByRoles(me, ["ROLE_ADMIN"]) && (
                <MenuItem onClick={() => handleClick("/funnel-states")} className={classes.nested}>
                  {intl.formatMessage({ id: "SUBMENU.FUNNEL_STATES" })}
                </MenuItem>
              )}
              {accessByRoles(me, ["ROLE_ADMIN"]) && (
                <MenuItem
                  onClick={() => setTariffOpen(!tariffOpen)}
                  className={classes.nester_nested}
                >
                  {intl.formatMessage({ id: "SUBMENU.TARIFFS" })}
                  {tariffOpen ? (
                    <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
                  ) : (
                    <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
                  )}
                </MenuItem>
              )}
              {accessByRoles(me, ["ROLE_ADMIN"]) && (
                <Collapse in={tariffOpen} timeout="auto" unmountOnExit>
                  <MenuItem
                    onClick={() => handleClick("/tariffs")}
                    className={classes.nested_nested}
                  >
                    {intl.formatMessage({ id: "SUBMENU.TARIFFS.LIMITS" })}
                  </MenuItem>
                  <MenuItem onClick={() => handleClick("/trial")} className={classes.nested_nested}>
                    {intl.formatMessage({ id: "SUBMENU.TARIFFS.TRIAL" })}
                  </MenuItem>
                </Collapse>
              )}
            </Collapse>
          )}

          {accessByRoles(me, ["ROLE_ADMIN"]) && (
            <MenuItem onClick={() => setDocsOpen(!docsOpen)} className={classes.nester}>
              {intl.formatMessage({ id: "MENU.DOCS" })}
              {docsOpen ? (
                <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
              ) : (
                <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
              )}
            </MenuItem>
          )}
          {accessByRoles(me, ["ROLE_ADMIN"]) && (
            <Collapse in={docsOpen} timeout="auto" unmountOnExit>
              <MenuItem onClick={() => handleClick("/userDocs/legacy")} className={classes.nested}>
                {intl.formatMessage({ id: "SUBMENU.LEGAL" })}
              </MenuItem>
            </Collapse>
          )}

          <MenuItem onClick={() => handleClick("/logout")}>
            {intl.formatMessage({ id: "MENU.LOGOUT" })}
          </MenuItem>
        </Menu>
      )}
    </div>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    leftMenuOpen: state.leftMenu.leftMenuOpen,
  }),
  { ...leftMenuActions }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(NewHeader));
