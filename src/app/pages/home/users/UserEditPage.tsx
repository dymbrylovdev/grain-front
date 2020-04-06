import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { useHistory, RouteComponentProps } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Paper, AppBar, makeStyles, Tabs, Tab, Divider } from "@material-ui/core";
import { useSnackbar } from "notistack";

import { actions as usersActions } from "../../../store/ducks/users.duck";
import { actions as authActions } from "../../../store/ducks/auth.duck";
import { actions as locationsActions } from "../../../store/ducks/locations.duck";
import { actions as googleLocationsActions } from "../../../store/ducks/googleLocations.duck";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LoadError } from "../../../components/ui/Errors";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import { TabPanel, a11yProps } from "../../../components/ui/Table/TabPanel";
import { ProfileForm, CompanyForm, LocationsForm } from "./components";

const useInnerStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    transition: "10",
  },
  dialogTitle: {
    padding: 0,
  },
  dialog: {
    height: "100%",
  },
  appBar: {
    boxShadow: "none",
    backgroundColor: "white",
    paddingTop: theme.spacing(0.5),
  },
  closeButton: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  },
  buttonContainer: {
    margin: theme.spacing(1),
  },
  textField: {
    width: 300,
  },
  badge: {
    paddingRight: theme.spacing(2),
  },
  tabPanel: {
    height: "100%",
  },
}));

const UserEditPage: React.FC<TPropsFromRedux &
  WrappedComponentProps &
  RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id },
  },
  match,
  intl,
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
  prompterRunning,
  prompterStep,

  fetchMe,
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

  mergeUser,
}) => {
  const innerClasses = useInnerStyles();
  const classes = useStyles();
  const history = useHistory();

  let editMode: "profile" | "create" | "edit";
  if (match.url.indexOf("profile") === -1) {
    if (+id) {
      editMode = "edit";
    } else {
      editMode = "create";
    }
  } else {
    editMode = "profile";
  }

  const [isAlertOpen, setAlertOpen] = useState(false);

  const [valueTabs, setValueTabs] = useState(0);
  const handleTabsChange = (event: any, newValue: number) => {
    setValueTabs(newValue);
  };

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (delError) {
      enqueueSnackbar(`${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${delError}`, {
        variant: "error",
      });
      setAlertOpen(false);
      clearDelUser();
    }
    if (delSuccess) {
      setAlertOpen(false);
      history.push("/user-list");
    }
  }, [clearDelUser, delError, delSuccess, enqueueSnackbar, history, intl]);

  useEffect(() => {
    if (createSuccess || createError) {
      enqueueSnackbar(
        createSuccess
          ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_CREATE" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${createError}`,
        {
          variant: createSuccess ? "success" : "error",
        }
      );
      clearCreateUser();
    }
    if (createSuccess) {
      history.push(`/user/edit/${createdUserId}`);
    }
  }, [
    clearCreateUser,
    createError,
    createSuccess,
    createdUserId,
    editError,
    editMode,
    enqueueSnackbar,
    fetchUser,
    history,
    intl,
  ]);

  useEffect(() => {
    if (editSuccess || editError) {
      enqueueSnackbar(
        editSuccess
          ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_USER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editError}`,
        {
          variant: editSuccess ? "success" : "error",
        }
      );
      clearCreateUser();
    }
    if (editSuccess) {
      fetchUser({ id: +id });
    }
  }, [clearCreateUser, editError, editSuccess, enqueueSnackbar, fetchUser, id, intl]);

  useEffect(() => {
    if (editMeSuccess || editMeError) {
      enqueueSnackbar(
        editMeSuccess
          ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_PROFILE" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editMeError}`,
        {
          variant: editMeSuccess ? "success" : "error",
        }
      );
      clearEditMe();
    }
    if (editMeSuccess) {
      fetchMe();
    }
  }, [clearEditMe, editError, editMeError, editMeSuccess, enqueueSnackbar, fetchMe, intl]);

  useEffect(() => {
    if (editMode === "edit") {
      fetchUser({ id: +id });
    } else {
      fetchMe();
    }
  }, [editMode, fetchMe, fetchUser, id]);

  useEffect(() => {
    fetchGoogleLocations("астр");
  }, [fetchGoogleLocations]);

  if (errorUser) return <LoadError handleClick={() => fetchUser({ id: +id })} />;
  if (errorMe) return <LoadError handleClick={() => fetchMe()} />;

  if ((editMode === "edit" && !user) || loadingMe || !statuses) return <Preloader />;

  return (
    <Paper className={classes.container}>
      <LayoutSubheader
        title={
          editMode === "profile"
            ? intl.formatMessage({ id: "SUBMENU.PROFILE" })
            : `${
                editMode === "create"
                  ? intl.formatMessage({ id: "SUBHEADER.PARTS.CREATE" })
                  : intl.formatMessage({ id: "SUBHEADER.PARTS.EDIT" })
              } ${intl.formatMessage({ id: "SUBHEADER.PARTS.USER" })}`
        }
        breadcrumb={undefined}
        description={undefined}
      />
      <div className={classes.form}>
        <AppBar position="static" color="default" className={innerClasses.appBar}>
          <Tabs
            value={valueTabs}
            onChange={handleTabsChange}
            indicatorColor="primary"
            textColor="primary"
            aria-label="tabs"
            centered
          >
            <Tab label={intl.formatMessage({ id: "USER.EDIT_FORM.PROFILE" })} {...a11yProps(0)} />
            <Tab label={intl.formatMessage({ id: "USER.EDIT_FORM.COMPANY" })} {...a11yProps(1)} />
            <Tab label={intl.formatMessage({ id: "USER.EDIT_FORM.LOCATIONS" })} {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <Divider />
        <TabPanel value={valueTabs} index={0}>
          <ProfileForm
            intl={intl}
            statuses={statuses}
            user={editMode === "create" ? undefined : editMode === "edit" ? user : me}
            editMode={editMode}
            prompterRunning={prompterRunning}
            prompterStep={prompterStep}
            loading={
              editMode === "create"
                ? createLoading
                : editMode === "edit"
                ? editLoading
                : editMeLoading
            }
            setAlertOpen={setAlertOpen}
            editMe={editMe}
            editUser={editUser}
            createUser={createUser}
          />
        </TabPanel>
        <TabPanel value={valueTabs} index={1}>
          {editMode === "create" ? (
            <p>{intl.formatMessage({ id: "COMPANY.FORM.NO_USER" })}</p>
          ) : (
            <CompanyForm
              intl={intl}
              statuses={statuses}
              user={editMode === "edit" ? user : me}
              editMode={editMode}
              prompterRunning={prompterRunning}
              prompterStep={prompterStep}
              loading={editMode === "edit" ? editLoading : editMeLoading}
              setAlertOpen={setAlertOpen}
              editMe={editMe}
              editUser={editUser}
              createUser={createUser}
              mergeUser={mergeUser}
            />
          )}
        </TabPanel>
        <TabPanel value={valueTabs} index={2}>
          {editMode === "create" ? (
            <p>{intl.formatMessage({ id: "LOCATIONS.FORM.NO_USER" })}</p>
          ) : (
            <LocationsForm
              intl={intl}
              statuses={statuses}
              user={editMode === "edit" ? user : me}
              editMode={editMode}
              prompterRunning={prompterRunning}
              prompterStep={prompterStep}
            />
          )}
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
  );
};

const connector = connect(
  (state: IAppState) => ({
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

    googleLocations: state.googleLocations.googleLocations,
    loadingGoogleLocations: state.googleLocations.loading,
    errorGoogleLocations: state.googleLocations.error,

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

    mergeUser: authActions.mergeUser,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(UserEditPage);
