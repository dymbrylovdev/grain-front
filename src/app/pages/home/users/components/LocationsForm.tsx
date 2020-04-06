import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import { IntlShape } from "react-intl";
import { TextField, Theme, IconButton, Grid, Button, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Formik, Form, useFormik } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from "notistack";
import * as Yup from "yup";

import { IUser, IUserForEdit, IUserForCreate } from "../../../../interfaces/users";
import useStyles from "../../styles";
import { ActionWithPayload, Action } from "../../../../utils/action-helper";
import { setMeValues, setCreateValues, setEditValues } from "../utils/submitValues";
import { getInitialValues } from "../utils/companyForm";
import CompanyConfirmBlock from "../../companies/components/CompanyConfirmBlock";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import CompanySearchForm from "../../companies/components/CompanySearchForm";
import { ILocation, ILocationToRequest } from "../../../../interfaces/locations";
import AutocompleteLocations from "../../../../components/AutocompleteLocations";
import { actions as googleLocationsActions } from "../../../../store/ducks/googleLocations.duck";
import { actions as locationsActions } from "../../../../store/ducks/locations.duck";
import { IAppState } from "../../../../store/rootDuck";
import Preloader from "../../../../components/ui/Loaders/Preloader";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";

const innerStyles = makeStyles((theme: Theme) => ({
  container: {
    flexDirection: "row",
    display: "flex",
  },
  group: {
    marginBottom: theme.spacing(2),
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
  intl: IntlShape;
  statuses: string[];
  user: IUser | undefined;
  editMode: "profile" | "create" | "edit";
  prompterRunning: boolean;
  prompterStep: number;
}

const LocationsForm: React.FC<IProps & TPropsFromRedux> = ({
  clearGoogleLocations,
  fetchGoogleLocations,
  googleLocations,
  loadingGoogleLocations,
  errorGoogleLocations,

  fetch,
  locations,
  loading,
  error,

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
  statuses,
  user,
  editMode,
  prompterRunning,
  prompterStep,
}) => {
  const innerClasses = innerStyles();
  const classes = useStyles();

  const [editNameId, setEditNameId] = useState(-1);
  const [creatingLocation, setCreatingLocation] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState(-1);

  const setSelectedLocation = (location: ILocationToRequest) => {
    setCreatingLocation(false);
    create(location);
    console.log(location);
  };

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
      clearCreate();
    }
  }, [clearCreate, createError, createSuccess, enqueueSnackbar, intl]);

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
      clearEdit();
    }
  }, [clearEdit, editError, editSuccess, enqueueSnackbar, intl]);

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
      clearDel();
    }
  }, [clearDel, delError, delSuccess, enqueueSnackbar, intl]);

  useEffect(() => {
    if (!locations && !loading) fetch();
  }, [fetch, loading, locations]);

  if (!locations) return <Preloader />;

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
                    loading={loadingGoogleLocations}
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
                    setSelectedLocation={setSelectedLocation}
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
          loading={loadingGoogleLocations}
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
          setSelectedLocation={setSelectedLocation}
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
    locations: state.locations.locations,
    loading: state.locations.loading,
    error: state.locations.error,

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
  }),
  {
    fetch: locationsActions.fetchRequest,
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

export default connector(LocationsForm);
