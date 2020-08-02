import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { useHistory, RouteComponentProps } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Paper, AppBar, Tabs, Tab, Divider, makeStyles } from "@material-ui/core";
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
import { TabPanel, a11yProps } from "../../../components/ui/Table/TabPanel";
import { ProfileForm, CompanyForm, LocationsForm } from "./components";
import { ErrorPage } from "../../../components/ErrorPage";
import Prompter from "../prompter/Prompter";
import ScrollToTop from "../../../components/ui/ScrollToTop";
import TariffForm from "./components/TariffForm";

const innerStyles = makeStyles(theme => ({
  pulseRoot: {
    animation: "2000ms ease-in-out infinite both TextFieldBorderPulse",
  },
}));

const UserEditPage: React.FC<TPropsFromRedux &
  WrappedComponentProps &
  RouteComponentProps<{ id: string }>> = ({
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

  let editMode: "profile" | "create" | "edit" | "view" = "profile";
  if (match.url.indexOf("profile") !== -1) editMode = "profile";
  if (match.url.indexOf("create") !== -1) editMode = "create";
  if (match.url.indexOf("edit") !== -1) editMode = "edit";
  if (match.url.indexOf("view") !== -1) editMode = "view";

  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isLocTabPulse, setLocTabPulse] = useState(false);

  useEffect(() => {
    if (!!me?.fio && !!me?.phone && me?.points.length === 0) setLocTabPulse(true);
    if (me?.points.length !== 0) setLocTabPulse(false);
  }, [me]);

  const [valueTabs, setValueTabs] = useState(0);
  const handleTabsChange = (event: any, newValue: number) => {
    setValueTabs(newValue);
  };

  const subTitle = (editMode: "profile" | "create" | "edit" | "view"): string => {
    switch (editMode) {
      case "profile":
        return intl.formatMessage({ id: "SUBMENU.PROFILE" });
      case "create":
        return (
          intl.formatMessage({ id: "SUBHEADER.PARTS.CREATE" }) +
          " " +
          intl.formatMessage({ id: "SUBHEADER.PARTS.USER" })
        );
      case "edit":
        return (
          intl.formatMessage({ id: "SUBHEADER.PARTS.EDIT" }) +
          " " +
          intl.formatMessage({ id: "SUBHEADER.PARTS.USER" })
        );
      case "view":
        return (
          intl.formatMessage({ id: "SUBHEADER.PARTS.VIEW" }) +
          " " +
          intl.formatMessage({ id: "SUBHEADER.PARTS.USER" })
        );
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

  if (errorMe || errorUser || funnelStatesError) return <ErrorPage />;

  return (
    <>
      <ScrollToTop />
      <Prompter />
      <Paper className={classes.container}>
        <LayoutSubheader
          title={subTitle(editMode)}
          breadcrumb={undefined}
          description={undefined}
        />
        <div className={classes.form}>
          <AppBar position="static" color="default" className={classes.appBar}>
            <Tabs
              value={valueTabs}
              onChange={handleTabsChange}
              indicatorColor="primary"
              textColor="primary"
              aria-label="tabs"
              centered
            >
              <Tab label={intl.formatMessage({ id: "USER.EDIT_FORM.PROFILE" })} {...a11yProps(0)} />

              {editMode !== "create" && (
                <Tab
                  classes={
                    prompterRunning && prompterStep === 0 && isLocTabPulse
                      ? { root: innerClasses.pulseRoot }
                      : {}
                  }
                  label={intl.formatMessage({ id: "USER.EDIT_FORM.LOCATIONS" })}
                  {...a11yProps(1)}
                />
              )}
              {editMode !== "create" && (
                <Tab
                  label={intl.formatMessage({ id: "USER.EDIT_FORM.COMPANY" })}
                  {...a11yProps(2)}
                />
              )}
              {(editMode === "edit" || editMode === "profile") && (
                <Tab
                  label={intl.formatMessage({ id: "USER.EDIT_FORM.TARIFFS" })}
                  {...a11yProps(3)}
                />
              )}
            </Tabs>
          </AppBar>
          <Divider />
          <TabPanel value={valueTabs} index={0}>
            <ProfileForm
              userId={+id || undefined}
              editMode={editMode}
              setAlertOpen={setAlertOpen}
              setLocTabPulse={setLocTabPulse}
            />
          </TabPanel>
          <TabPanel value={valueTabs} index={1}>
            {editMode === "create" ? (
              <p>{intl.formatMessage({ id: "LOCATIONS.FORM.NO_USER" })}</p>
            ) : (
              <LocationsForm editMode={editMode} userId={+id || undefined} />
            )}
          </TabPanel>
          <TabPanel value={valueTabs} index={2}>
            {editMode === "create" ? (
              <p>{intl.formatMessage({ id: "COMPANY.FORM.NO_USER" })}</p>
            ) : (
              <CompanyForm userId={+id || undefined} editMode={editMode} />
            )}
          </TabPanel>
          <TabPanel value={valueTabs} index={3}>
            <TariffForm editMode={editMode} userId={+id || undefined} />
          </TabPanel>
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
