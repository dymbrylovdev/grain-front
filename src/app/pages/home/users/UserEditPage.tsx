import React, { useEffect, useState, useCallback } from "react";
import { compose } from "redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { AppBar, Button, Divider, makeStyles, Paper, Tab, Tabs } from "@material-ui/core";
import { useSnackbar } from "notistack";

import { actions as usersActions } from "../../../store/ducks/users.duck";
import { actions as authActions } from "../../../store/ducks/auth.duck";
import { actions as locationsActions } from "../../../store/ducks/locations.duck";
import { actions as googleLocationsActions } from "../../../store/ducks/yaLocations.duck";
import { actions as prompterActions } from "../../../store/ducks/prompter.duck";

import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import { a11yProps, TabPanel } from "../../../components/ui/Table/TabPanel";
import { BidsForm, CropsForm, FilterForm, LocationsForm, ProfileForm } from "./components";
import ScrollToTop from "../../../components/ui/ScrollToTop";
import TariffForm from "./components/TariffForm/TariffForm";
import { accessByRoles } from "../../../utils/utils";
import OptionsForm from "./components/OptionsForm";
import { Skeleton } from "@material-ui/lab";
import BestDealsProfile from "./components/BestDealsProfile";

const innerStyles = makeStyles(theme => ({
  pulseRoot: {
    animation: "2000ms ease-in-out infinite both TextFieldBorderPulse",
  },
}));

const UserEditPage: React.FC<TPropsFromRedux & WrappedComponentProps & RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id },
  },
  funnelStatesError,

  match,
  intl,

  fetchMe,
  me,
  loadingMe,
  errorMe,

  editMeLoading,
  editMeSuccess,
  editMeError,

  user,
  loadingUser,
  errorUser,

  fetchLocations,
  locations,
  loadingLocations,
  errorLocations,

  clearGoogleLocations,
  fetchGoogleLocations,
  googleLocations,
  loadingGoogleLocations,
  errorGoogleLocations,

  createdUserId,
  createLoading,
  createSuccess,
  createError,
  delLoading,
  delSuccess,
  delError,
  editLoading,
  editSuccess,
  editError,

  statuses,
  runPrompter,
  prompterRunning,
  prompterStep,

  clearEditMe,
  editMe,

  clearUser,
  fetchUser,

  clearCreateUser,
  createUser,
  clearDelUser,
  delUser,
  clearEditUser,
  editUser,
}) => {
  const classes = useStyles();
  const innerClasses = innerStyles();
  const history = useHistory();

  let editMode: "profile" | "create" | "edit" | "view" = "create";
  if (match.url.indexOf("profile") !== -1) editMode = "profile";
  if (match.url.indexOf("create") !== -1) editMode = "create";
  if (match.url.indexOf("edit") !== -1) editMode = "edit";
  if (match.url.indexOf("view") !== -1) editMode = "view";

  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isLocTabPulse, setLocTabPulse] = useState(false);
  const [valueTabs, setValueTabs] = useState(0);

  useEffect(() => {
    if (editMode === "create") setValueTabs(0);
  }, [editMode]);

  useEffect(() => {
    const wasBidEditPage = localStorage.getItem("WasBidEditPage");

    if (wasBidEditPage) {
      accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && editMode === "edit" && setValueTabs(3);
      localStorage.removeItem("WasBidEditPage");
    }
  }, [me, editMode]);

  const accessTransporter = useCallback(() => {
    return accessByRoles(me, ["ROLE_TRANSPORTER"]);
  }, [me, editMode]);

  useEffect(() => {
    if (editMode === "profile") {
      if (match.url.indexOf("profile") !== -1) {
        setValueTabs(0);
      }
      if (match.url.indexOf("profile/points") !== -1) {
        isAdminProfile() ? setValueTabs(1) : setValueTabs(2);
      }
      if (match.url.indexOf("profile/crops") !== -1) {
        isAdminProfile() ? setValueTabs(2) : setValueTabs(3);
      }

      if (accessTransporter() && match.url.indexOf("profile/options") !== -1) {
        setValueTabs(1);
        return;
      }

      if (match.url.indexOf("profile/tariffs") !== -1) {
        accessTransporter() ? setValueTabs(2) : setValueTabs(1);
      }
    }
  }, [match.url, editMode]);

  useEffect(() => {
    if (!!me?.fio && !!me?.phone && me?.points?.length === 0) setLocTabPulse(true);
    if (me?.points?.length !== 0) setLocTabPulse(false);
  }, [me]);

  const handleTabsChange = (event: any, newValue: number) => {
    setValueTabs(newValue);

    if (editMode === "profile") {
      if (newValue === 0) history.push("/user/profile");
      if (newValue === 1)
        accessTransporter()
          ? history.push("/user/profile/options")
          : isAdminProfile()
            ? history.push("/user/profile/points")
            : history.push("/user/profile/tariffs");
      if (newValue === 2)
        accessTransporter()
          ? history.push("/user/profile/tariffs")
          : isAdminProfile()
            ? history.push("/user/profile/crops")
            : history.push("/user/profile/points");
      if (newValue === 3) history.push("/user/profile/crops");
    }
  };

  const subTitle = (editMode: "profile" | "create" | "edit" | "view"): string => {
    switch (editMode) {
      case "profile":
        return intl.formatMessage({ id: "SUBMENU.PROFILE" });
      case "create":
        return intl.formatMessage({ id: "SUBHEADER.PARTS.CREATE" }) + " " + intl.formatMessage({ id: "SUBHEADER.PARTS.USER" });
      case "edit":
        return intl.formatMessage({ id: "SUBHEADER.PARTS.EDIT" }) + " " + intl.formatMessage({ id: "SUBHEADER.PARTS.USER" });
      case "view":
        return intl.formatMessage({ id: "SUBHEADER.PARTS.VIEW" }) + " " + intl.formatMessage({ id: "SUBHEADER.PARTS.USER" });
    }
  };

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (delSuccess || delError) {
      enqueueSnackbar(
        delSuccess
          ? intl.formatMessage({ id: "NOTISTACK.ERRORS.DEL_USER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${delError}`,
        {
          variant: delSuccess ? "success" : "error",
        }
      );
      setAlertOpen(false);
      clearDelUser();
    }
    if (delSuccess) {
      history.push(`/user-list`);
    }
  }, [clearDelUser, delError, delSuccess, enqueueSnackbar, history, intl]);

  useEffect(() => {
    switch (editMode) {
      case "edit":
      case "view":
        fetchUser({ id: +id });
        break;
    }
    return () => {
      clearUser();
    };
  }, [clearUser, editMode, fetchUser, id]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (!prompterRunning && editMode === "profile") {
      if (!me?.fio || !me?.phone || me?.points.length === 0) {
        if (me?.is_buyer) runPrompter("buyer");
        if (me?.is_vendor) runPrompter("seller");
      }
    }
  }, [editMode, me, prompterRunning, runPrompter]);

  if (errorMe || errorUser || funnelStatesError) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  const isTransporterProfile = useCallback(() => {
    return accessByRoles(user, ["ROLE_TRANSPORTER"]);
  }, [user]);
  const isAdminProfile = useCallback(() => {
    return accessByRoles(me, ["ROLE_ADMIN"]) && editMode === "profile";
  }, [user, editMode]);

  const firstDate = useCallback(() => {
    if (editMode === "view") {
      return intl.formatDate(user?.first_login_at)
    }
    if (editMode === "profile") {
      return intl.formatDate(me?.first_login_at)
    }
    if (editMode === "edit" && accessByRoles(me, ["ROLE_ADMIN"])) {
      return intl.formatDate(user?.first_login_at)
    }

  }, [me, user]);

  return (
    <>
      <ScrollToTop />
      <Paper className={classes.paperWithForm}>
        <LayoutSubheader title={subTitle(editMode)} breadcrumb={undefined} description={undefined} />
        <div className={classes.form} style={valueTabs === 4 || valueTabs === 3 || valueTabs === 1 ? { maxWidth: 1000 } : undefined}>
          <div className={classes.topButtonsContainer}>
            <div className={classes.flexRow} style={{ width: "100%", alignItems: "center", justifyContent: "space-between" }}>
              {!accessByRoles(me, ["ROLE_TRANSPORTER"]) && !(accessByRoles(user, ["ROLE_TRANSPORTER"]) && editMode === "view") && (
                <div className={classes.button}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      history.goBack();
                    }}
                    disabled={loadingMe || loadingUser}
                  >
                    {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
                  </Button>
                </div>
              )}
            </div>
          </div>
          <AppBar position="static" color="default" className={classes.appBar}>
            {user || window.location.href.includes("profile") || window.location.href.includes("create") ? (
              <>
              <div>Дата регистрации: {firstDate()}</div>
              <Tabs
                value={valueTabs}
                onChange={handleTabsChange}
                variant="scrollable"
                indicatorColor="primary"
                textColor="primary"
                aria-label="tabs"
              >
                <Tab label={intl.formatMessage({ id: "USER.EDIT_FORM.PROFILE" })} {...a11yProps(0)} />

                {accessByRoles(me, ["ROLE_BUYER", "ROLE_ADMIN", "ROLE_TRADER"]) && (
                  <Tab label={intl.formatMessage({ id: "USER.EDIT_FORM.BEST.BIDS" })} {...a11yProps(5)} />
                )}

                {((me && editMode === "profile" && !["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0])) ||
                  (user && editMode === "edit" && ["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"].includes(user.roles[0]))) && (
                    <Tab
                      label={intl.formatMessage({ id: "USER.EDIT_FORM.TARIFFS" })}
                      {...a11yProps(accessByRoles(me, ["ROLE_TRANSPORTER"]) ? 2 : 1)}
                    />
                  )}

                {!isTransporterProfile() && accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && editMode === "edit" && (
                  <Tab label={intl.formatMessage({ id: "USER.EDIT_FORM.BIDS" })} {...a11yProps(2)} />
                )}
                {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && !accessByRoles(user, ["ROLE_TRANSPORTER"]) && editMode === "edit" && (
                  <Tab label={intl.formatMessage({ id: "USER.EDIT_FORM.FILTERS" })} {...a11yProps(5)} />
                )}

                {editMode !== "create" && !accessByRoles(me, ["ROLE_TRANSPORTER"]) && !accessByRoles(user, ["ROLE_TRANSPORTER"]) && (
                  <Tab
                    classes={prompterRunning && prompterStep === 0 && isLocTabPulse ? { root: innerClasses.pulseRoot } : {}}
                    label={
                      accessByRoles(editMode === "profile" ? me : user, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"])
                        ? intl.formatMessage({ id: "USER.EDIT_FORM.LOCATIONS" })
                        : accessByRoles(editMode === "profile" ? me : user, ["ROLE_VENDOR"])
                          ? intl.formatMessage({ id: "USER.EDIT_FORM.LOCATIONS.SALE" })
                          : intl.formatMessage({ id: "USER.EDIT_FORM.LOCATIONS.PURCHASE" })
                    }
                    {...a11yProps(1)}
                  />
                )}

                {accessByRoles(me, ["ROLE_ADMIN"]) && editMode === "create" && !user ? null : (me &&
                  editMode !== "create" &&
                  accessTransporter()) ||
                  accessByRoles(user, ["ROLE_TRANSPORTER"]) ? (
                  <Tab
                    label={intl.formatMessage({ id: "USER.EDIT_FORM.OPTIONS" })}
                    {...a11yProps(accessByRoles(me, ["ROLE_TRANSPORTER"]) || accessByRoles(user, ["ROLE_TRANSPORTER"]) ? 1 : 2)}
                  />
                ) : (
                  !isTransporterProfile() && (
                    <Tab className={classes.displayNone} label={intl.formatMessage({ id: "USER.EDIT_FORM.CROPS" })} {...a11yProps(2)} />
                  )
                )}
              </Tabs>
              </>
            ) : (
              <Skeleton width="100%" height={50} animation="wave" />
            )}
          </AppBar>
          <Divider />
          <TabPanel value={valueTabs} index={0}>
            <ProfileForm
              userId={+id || undefined}
              isTransporterProfile={isTransporterProfile}
              editMode={editMode}
              setAlertOpen={setAlertOpen}
              setLocTabPulse={setLocTabPulse}
            />
          </TabPanel>

          {accessByRoles(me, ["ROLE_BUYER", "ROLE_ADMIN", "ROLE_TRADER"]) && (
            <TabPanel value={valueTabs} index={1}>
              <BestDealsProfile vendorId={+id}/>
            </TabPanel>
          )}

          {((me && editMode === "profile" && !["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0])) ||
            (user && editMode === "edit" && ["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"].includes(user.roles[0]))) && (
              <TabPanel value={valueTabs} index={2}>
                <TariffForm editMode={editMode} userId={+id || undefined} />
              </TabPanel>
            )}

          {!accessByRoles(user, ["ROLE_TRANSPORTER"]) && !accessByRoles(me, ["ROLE_TRANSPORTER"]) && (
            <TabPanel value={valueTabs} index={editMode === "profile" ? (isAdminProfile() ? 2 : 3) : 5}>
              {editMode === "create" ? (
                <p>{intl.formatMessage({ id: "LOCATIONS.FORM.NO_USER" })}</p>
              ) : (
                <LocationsForm editMode={editMode} userId={+id || undefined} />
              )}
            </TabPanel>
          )}

          {accessByRoles(me, ["ROLE_TRANSPORTER"]) || accessByRoles(user, ["ROLE_TRANSPORTER"]) ? (
            <TabPanel value={valueTabs} index={editMode === "profile" ? 3 : 2}>
              {editMode === "create" ? <p>{intl.formatMessage({ id: "COMPANY.FORM.NO_USER" })}</p> : <OptionsForm editMode={editMode} />}
            </TabPanel>
          ) : (
            <TabPanel value={valueTabs} index={editMode === "profile" ? (isAdminProfile() ? 3 : 4) : 6}>
              {editMode === "create" ? (
                <p>{intl.formatMessage({ id: "COMPANY.FORM.NO_USER" })}</p>
              ) : (
                !isTransporterProfile() && <CropsForm userId={+id || undefined} editMode={editMode} />
              )}
            </TabPanel>
          )}

          {user && (
            <TabPanel value={valueTabs} index={["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"].includes(user.roles[0]) ? 3 : 4}>
              <BidsForm userId={+id || undefined} classes={classes} isBuyer={user.is_buyer} />
            </TabPanel>
          )}

          {user && (
            <TabPanel
              value={valueTabs}
              index={
                !(
                  (me && editMode === "profile" && !["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0])) ||
                  (user && editMode === "edit" && ["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"].includes(user.roles[0]))
                )
                  ? !isTransporterProfile()
                    ? 5
                    : 3
                  : 4
              }
            >
              <FilterForm match={match} userId={+id || undefined} />
            </TabPanel>
          )}
        </div>
        <AlertDialog
          isOpen={isAlertOpen}
          text={intl.formatMessage({
            id: "USERLIST.DIALOGS.DELETE_TEXT",
          })}
          okText={intl.formatMessage({
            id: "USERLIST.DIALOGS.AGREE_TEXT",
          })}
          cancelText={intl.formatMessage({
            id: "USERLIST.DIALOGS.CANCEL_TEXT",
          })}
          handleClose={() => setAlertOpen(false)}
          handleAgree={() => delUser({ id: +id })}
          loadingText={intl.formatMessage({
            id: "USERLIST.DIALOGS.LOADING_TEXT",
          })}
          isLoading={delLoading}
        />
      </Paper>
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
    funnelStatesError: state.funnelStates.error,

    me: state.auth.user,
    loadingMe: state.auth.loading,
    errorMe: state.auth.error,

    editMeLoading: state.auth.editLoading,
    editMeSuccess: state.auth.editSuccess,
    editMeError: state.auth.editError,

    user: state.users.user,
    loadingUser: state.users.byIdLoading,
    errorUser: state.users.byIdError,

    locations: state.locations.locations,
    loadingLocations: state.locations.loading,
    errorLocations: state.locations.error,

    googleLocations: state.yaLocations.yaLocations,
    loadingGoogleLocations: state.yaLocations.loading,
    errorGoogleLocations: state.yaLocations.error,

    createdUserId: state.users.createdUserId,
    createLoading: state.users.createLoading,
    createSuccess: state.users.createSuccess,
    createError: state.users.createError,
    delLoading: state.users.delLoading,
    delSuccess: state.users.delSuccess,
    delError: state.users.delError,
    editLoading: state.users.editLoading,
    editSuccess: state.users.editSuccess,
    editError: state.users.editError,

    statuses: state.statuses.statuses,
    prompterRunning: state.prompter.running,
    prompterStep: state.prompter.activeStep,
  }),
  {
    fetchMe: authActions.fetchRequest,
    clearEditMe: authActions.clearEdit,
    editMe: authActions.editRequest,

    clearUser: usersActions.clearFetchById,
    fetchUser: usersActions.fetchByIdRequest,

    fetchLocations: locationsActions.fetchRequest,

    clearGoogleLocations: googleLocationsActions.clear,
    fetchGoogleLocations: googleLocationsActions.fetchRequest,

    clearCreateUser: usersActions.clearCreate,
    createUser: usersActions.createRequest,
    clearDelUser: usersActions.clearDel,
    delUser: usersActions.delRequest,
    clearEditUser: usersActions.clearEdit,
    editUser: usersActions.editRequest,

    runPrompter: prompterActions.runPrompter,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(UserEditPage);
