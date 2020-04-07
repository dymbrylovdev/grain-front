import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import {
  TextField,
  Theme,
  IconButton,
  Grid,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from "notistack";
import * as Yup from "yup";

import useStyles from "../../styles";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import { ILocationToRequest, ILocation } from "../../../../interfaces/locations";
import AutocompleteLocations from "../../../../components/AutocompleteLocations";
import { actions as googleLocationsActions } from "../../../../store/ducks/yaLocations.duck";
import { actions as locationsActions } from "../../../../store/ducks/locations.duck";
import { actions as authActions } from "../../../../store/ducks/auth.duck";
import { actions as usersActions } from "../../../../store/ducks/users.duck";
import { IAppState } from "../../../../store/rootDuck";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";
import { LocationsSkeleton } from "../skeletons";

const innerStyles = makeStyles((theme: Theme) => ({
  container: {
    flexDirection: "row",
    display: "flex",
  },
  group: {
    marginBottom: theme.spacing(2),
    minHeight: 200,
    padding: theme.spacing(2),
    border: "1px solid",
    borderColor: "#e0e0e0",
    borderRadius: 4,
  },
  name: {
    marginRight: theme.spacing(1),
  },
  pulseRoot: {
    "& fieldset": {
      animation: "2000ms ease-in-out infinite both TextFieldBorderPulse",
    },
  },
}));

interface IProps {
  editMode: "profile" | "create" | "edit";
  userId?: number;
}

const LocationsForm: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({
  clearGoogleLocations,
  fetchGoogleLocations,
  googleLocations,
  loadingGoogleLocations,
  errorGoogleLocations,

  fetchMe,
  me,
  loadingMe,
  errorMe,

  fetchUser,
  user,
  loadingUser,
  errorUser,

  clearCreate,
  create,
  createLoading,
  createSuccess,
  createError,

  clearEdit,
  edit,
  editLoading,
  editSuccess,
  editError,

  clearDel,
  del,
  delLoading,
  delSuccess,
  delError,

  intl,
  editMode,
  userId,
  prompterRunning,
  prompterStep,
}) => {
  const innerClasses = innerStyles();
  const classes = useStyles();
  let locations: ILocation[] = [];
  if (editMode === "profile" && me) locations = me.points;
  if (editMode === "edit" && user) locations = user.points;

  const [editNameId, setEditNameId] = useState(-1);
  const [creatingLocation, setCreatingLocation] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState(-1);

  const { values, handleChange, resetForm } = useFormik({
    initialValues: { name: "" },
    onSubmit: () => {},
    validationSchema: Yup.object().shape({
      name: Yup.string().required(intl.formatMessage({ id: "LOCATIONS.INPUT.NAME.YUP" })),
    }),
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (createSuccess || createError) {
      enqueueSnackbar(
        createSuccess
          ? intl.formatMessage({ id: "NOTISTACK.POINTS.CREATE" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${createError}`,
        {
          variant: createSuccess ? "success" : "error",
        }
      );
      if (editMode === "profile") fetchMe();
      if (editMode === "edit" && userId) fetchUser({ id: userId });
      clearCreate();
    }
  }, [
    clearCreate,
    createError,
    createSuccess,
    editMode,
    enqueueSnackbar,
    fetchMe,
    fetchUser,
    intl,
    userId,
  ]);

  useEffect(() => {
    if (editSuccess || editError) {
      enqueueSnackbar(
        editSuccess
          ? intl.formatMessage({ id: "NOTISTACK.POINTS.EDIT" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editError}`,
        {
          variant: editSuccess ? "success" : "error",
        }
      );
      setEditNameId(-1);
      if (editMode === "profile") fetchMe();
      if (editMode === "edit" && userId) fetchUser({ id: userId });
      clearEdit();
    }
  }, [
    clearEdit,
    editError,
    editMode,
    editSuccess,
    enqueueSnackbar,
    fetchMe,
    fetchUser,
    intl,
    userId,
  ]);

  useEffect(() => {
    if (delSuccess || delError) {
      enqueueSnackbar(
        delSuccess
          ? intl.formatMessage({ id: "NOTISTACK.POINTS.DEL" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${delError}`,
        {
          variant: delSuccess ? "success" : "error",
        }
      );
      setAlertOpen(false);
      if (editMode === "profile") fetchMe();
      if (editMode === "edit" && userId) fetchUser({ id: userId });
      clearDel();
    }
  }, [clearDel, delError, delSuccess, editMode, enqueueSnackbar, fetchMe, fetchUser, intl, userId]);

  if (loadingMe || loadingUser) return <LocationsSkeleton intl={intl} count={locations.length} />;

  return (
    <div>
      {!locations.length ? (
        <div className={classes.text}>
          {intl.formatMessage({ id: "LOCATIONS.FORM.NO_LOCATIONS" })}
        </div>
      ) : (
        locations.map(item => (
          <Grid
            container
            direction="column"
            justify="space-around"
            alignItems="stretch"
            key={item.id}
            className={innerClasses.group}
          >
            <Grid item>
              {editNameId === item.id ? (
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <div className={innerClasses.name} style={{ flex: "auto" }}>
                    <TextField
                      type="text"
                      label={intl.formatMessage({
                        id: "LOCATIONS.INPUT.NAME",
                      })}
                      margin="normal"
                      className={classes.textField}
                      value={values.name}
                      name="name"
                      variant="outlined"
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>
                  <Grid item className={innerClasses.name}>
                    <ButtonWithLoader
                      disabled={editLoading}
                      loading={editLoading}
                      onPress={() => edit({ id: item.id, data: { name: values.name } })}
                    >
                      {intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
                    </ButtonWithLoader>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="primary" onClick={() => setEditNameId(-1)}>
                      {intl.formatMessage({ id: "ALL.BUTTONS.CANCEL" })}
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>{item.name}</Grid>
                  <Grid item>
                    <IconButton
                      color="primary"
                      size={"medium"}
                      onClick={() => {
                        setEditNameId(item.id);
                        resetForm({ values: { name: item.name } });
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid item>
              <Grid container direction="row" justify="flex-start" alignItems="center">
                <div style={{ flex: "auto" }}>
                  <AutocompleteLocations
                    id={item.id.toString()}
                    options={googleLocations ? googleLocations : [{ text: "" }]}
                    loading={false}
                    defaultValue={{
                      text: item.text ? item.text : "",
                    }}
                    label={intl.formatMessage({
                      id: "PROFILE.INPUT.LOCATION",
                    })}
                    editable={!(item && item.text)}
                    inputClassName={classes.textField}
                    inputError={Boolean(errorGoogleLocations)}
                    inputHelperText={errorGoogleLocations}
                    fetchLocations={fetchGoogleLocations}
                    clearLocations={clearGoogleLocations}
                    setSelectedLocation={(location: ILocationToRequest) => {
                      if (location) {
                        delete location.name;
                        edit({ id: item.id, data: location });
                      }
                    }}
                    disable={false}
                    prompterRunning={prompterRunning}
                    prompterStep={prompterStep}
                  />
                </div>
                <Grid item>
                  <IconButton
                    size={"medium"}
                    onClick={() => {
                      setDeleteLocationId(item.id);
                      setAlertOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={<Checkbox checked={true} onChange={handleChange} name="checkedA" />}
                label="подписаться"
              />
            </Grid>
          </Grid>
        ))
      )}
      {!creatingLocation ? (
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          spacing={1}
          className={classes.buttonContainer}
        >
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => setCreatingLocation(true)}>
              {intl.formatMessage({ id: "LOCATIONS.FORM.ADD_LOCATIONS" })}
            </Button>
          </Grid>
        </Grid>
      ) : (
        <AutocompleteLocations
          options={googleLocations ? googleLocations : [{ text: "" }]}
          loading={false}
          defaultValue={{ text: "" }}
          label={intl.formatMessage({
            id: "PROFILE.INPUT.LOCATION",
          })}
          editable={true}
          inputClassName={classes.textField}
          inputError={Boolean(errorGoogleLocations)}
          inputHelperText={errorGoogleLocations}
          fetchLocations={fetchGoogleLocations}
          clearLocations={clearGoogleLocations}
          setSelectedLocation={(location: ILocationToRequest) => {
            if (location) {
              setCreatingLocation(false);
              create(location);
            }
          }}
          handleBlur={() => setCreatingLocation(false)}
          disable={false}
          prompterRunning={prompterRunning}
          prompterStep={prompterStep}
        />
      )}
      <AlertDialog
        isOpen={isAlertOpen}
        text={intl.formatMessage({
          id: "LOCATIONS.DIALOGS.DELETE_TEXT",
        })}
        okText={intl.formatMessage({
          id: "USERLIST.DIALOGS.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "USERLIST.DIALOGS.CANCEL_TEXT",
        })}
        handleClose={() => setAlertOpen(false)}
        handleAgree={() => del({ id: deleteLocationId })}
        loadingText={intl.formatMessage({
          id: "ALL.DIALOGS.DEL_TEXT",
        })}
        isLoading={delLoading}
      />
    </div>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    loadingMe: state.auth.loading,
    errorMe: state.auth.error,

    user: state.users.user,
    loadingUser: state.users.byIdLoading,
    errorUser: state.users.byIdError,

    createLoading: state.locations.createLoading,
    createSuccess: state.locations.createSuccess,
    createError: state.locations.createError,

    editLoading: state.locations.editLoading,
    editSuccess: state.locations.editSuccess,
    editError: state.locations.editError,

    delLoading: state.locations.delLoading,
    delSuccess: state.locations.delSuccess,
    delError: state.locations.delError,

    googleLocations: state.googleLocations.googleLocations,
    loadingGoogleLocations: state.googleLocations.loading,
    errorGoogleLocations: state.googleLocations.error,

    prompterRunning: state.prompter.running,
    prompterStep: state.prompter.activeStep,
  }),
  {
    fetchMe: authActions.fetchRequest,
    fetchUser: usersActions.fetchByIdRequest,

    clearCreate: locationsActions.clearCreate,
    create: locationsActions.createRequest,

    clearEdit: locationsActions.clearEdit,
    edit: locationsActions.editRequest,

    clearDel: locationsActions.clearDel,
    del: locationsActions.delRequest,

    clearGoogleLocations: googleLocationsActions.clear,
    fetchGoogleLocations: googleLocationsActions.fetchRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(LocationsForm));
