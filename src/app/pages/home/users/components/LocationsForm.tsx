import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import {
  TextField,
  Theme,
  IconButton,
  Grid as div,
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
import { Skeleton } from "@material-ui/lab";
import { accessByRoles } from "../../../../utils/utils";

const innerStyles = makeStyles((theme: Theme) => ({
  name: {
    marginLeft: theme.spacing(1),
  },
  button: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
  },

  pulseRoot: {
    "& fieldset": {
      animation: "2000ms ease-in-out infinite both TextFieldBorderPulse",
    },
  },
}));

interface IProps {
  editMode: "profile" | "create" | "edit" | "view";
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
  if ((editMode === "edit" || editMode === "view") && user) locations = user.points;

  const [editNameId, setEditNameId] = useState(-1);
  const [creatingLocation, setCreatingLocation] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState(-1);
  const [autoLocation, setAutoLocation] = useState({ text: "" });

  const { values, handleChange, resetForm, handleSubmit, errors, touched } = useFormik({
    initialValues: { name: "" },
    onSubmit: () => {
      edit({
        id: editNameId,
        data: { name: values.name.trim(), user_id: userId || me?.id },
      });
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required(intl.formatMessage({ id: "LOCATIONS.INPUT.NAME.YUP" }))
        .trim(),
    }),
  });

  // useEffect(() => {
  //   switch (editMode) {
  //     case "profile":
  //       fetchMe();
  //       break;
  //     case "edit":
  //     case "view":
  //       if (userId) fetchUser({ id: userId });
  //       break;
  //   }
  // }, [editMode, fetchMe, fetchUser, userId]);

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

  return (
    <div>
      {!locations.length ? (
        <div className={classes.text}>
          {loadingMe || loadingUser ? (
            <Skeleton width="70%" height={24} animation="wave" />
          ) : (
            intl.formatMessage({ id: "LOCATIONS.FORM.NO_LOCATIONS" })
          )}
        </div>
      ) : (
        <>
          {locations.map(item => (
            <div key={item.id} className={classes.box}>
              <div className={classes.textFieldContainer}>
                {loadingMe || loadingUser ? (
                  <Skeleton width="70%" height={30} animation="wave" />
                ) : editNameId === item.id ? (
                  <>
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
                      helperText={touched.name && errors.name}
                      error={Boolean(touched.name && errors.name)}
                      autoFocus
                    />
                    <div className={innerClasses.button}>
                      <ButtonWithLoader
                        disabled={editLoading}
                        loading={editLoading}
                        onPress={() => {
                          setEditNameId(item.id);
                          handleSubmit();
                        }}
                      >
                        {intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
                      </ButtonWithLoader>
                    </div>
                    <Button variant="outlined" color="primary" onClick={() => setEditNameId(-1)}>
                      {intl.formatMessage({ id: "ALL.BUTTONS.CANCEL" })}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className={innerClasses.name}>{item.text}</div>
                    {editMode !== "view" && (
                      <div>
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
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className={classes.textFieldContainer}>
                {loadingMe || loadingUser ? (
                  <Skeleton width="100%" height={70} animation="wave" />
                ) : (
                  <>
                    <div className={classes.textField}>
                      <AutocompleteLocations
                        id={item.id.toString()}
                        options={googleLocations || []}
                        loading={false}
                        inputValue={item}
                        label={
                          accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"])
                            ? intl.formatMessage({ id: "PROFILE.INPUT.LOCATION" })
                            : accessByRoles(me, ["ROLE_VENDOR"])
                            ? intl.formatMessage({ id: "PROFILE.INPUT.LOCATION.SALE" })
                            : intl.formatMessage({ id: "PROFILE.INPUT.LOCATION.PURCHASE" })
                        }
                        editable={!(item && item.text)}
                        inputClassName={classes.textField}
                        inputError={Boolean(errorGoogleLocations)}
                        inputHelperText={errorGoogleLocations}
                        fetchLocations={fetchGoogleLocations}
                        clearLocations={clearGoogleLocations}
                        setSelectedLocation={(location: ILocationToRequest) => {
                          if (location.text !== "") {
                            delete location.name;
                            location.user_id = userId || me?.id;
                            edit({ id: item.id, data: location });
                          }
                        }}
                        disable={editMode === "view"}
                        prompterRunning={me?.points.length === 0 ? prompterRunning : false}
                        prompterStep={prompterStep}
                      />
                    </div>
                    {editMode !== "view" && (
                      <div>
                        <IconButton
                          size={"medium"}
                          onClick={() => {
                            setDeleteLocationId(item.id);
                            setAlertOpen(true);
                          }}
                          color="secondary"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    )}
                  </>
                )}
              </div>
              {editMode !== "view" && (
                <div>
                  {loadingMe || loadingUser ? (
                    <Skeleton width={300} height={41} animation="wave" />
                  ) : (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.active}
                          onChange={() => {
                            edit({
                              id: item.id,
                              data: { active: !item.active, user_id: userId || me?.id },
                            });
                          }}
                        />
                      }
                      label={intl.formatMessage({
                        id: "USER.EDIT_FORM.LOCATIONS.ACTIVE",
                      })}
                      name="active"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
          {editMode !== "view" &&
            (loadingMe || loadingUser ? (
              <p>
                <Skeleton width="100%" height={22} animation="wave" />
              </p>
            ) : (
              <p>{intl.formatMessage({ id: "LOCATIONS.MORE" })}</p>
            ))}
        </>
      )}

      {editMode !== "view" && (
        <div className={classes.box}>
          <div className={classes.textFieldContainer}>
            {!creatingLocation ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setCreatingLocation(true)}
                disabled={loadingMe || loadingUser}
              >
                {intl.formatMessage({ id: "LOCATIONS.FORM.ADD_LOCATIONS" })}
              </Button>
            ) : (
              <div className={classes.textField}>
                <AutocompleteLocations
                  options={googleLocations || []}
                  loading={false}
                  inputValue={autoLocation}
                  label={
                    accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"])
                      ? intl.formatMessage({ id: "PROFILE.INPUT.LOCATION" })
                      : accessByRoles(me, ["ROLE_VENDOR"])
                      ? intl.formatMessage({ id: "PROFILE.INPUT.LOCATION.SALE" })
                      : intl.formatMessage({ id: "PROFILE.INPUT.LOCATION.PURCHASE" })
                  }
                  editable={true}
                  inputClassName={classes.textField}
                  inputError={Boolean(errorGoogleLocations)}
                  inputHelperText={errorGoogleLocations}
                  fetchLocations={fetchGoogleLocations}
                  clearLocations={clearGoogleLocations}
                  setSelectedLocation={(location: ILocationToRequest) => {
                    if (location.text !== "") {
                      setAutoLocation({ text: "" });
                      userId ? (location.user_id = userId) : (location.user_id = me?.id);
                      setCreatingLocation(false);
                      create(location);
                    }
                  }}
                  handleBlur={() => setCreatingLocation(false)}
                  disable={false}
                  prompterRunning={me?.points.length === 0 ? prompterRunning : false}
                  prompterStep={prompterStep}
                />
              </div>
            )}
          </div>
        </div>
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

    googleLocations: state.yaLocations.yaLocations,
    loadingGoogleLocations: state.yaLocations.loading,
    errorGoogleLocations: state.yaLocations.error,

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
