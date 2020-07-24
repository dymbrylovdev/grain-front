import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { TextField, Theme, IconButton, Grid as div, Button, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from "notistack";
import * as Yup from "yup";

import { actions as googleLocationsActions } from "../../../../store/ducks/yaLocations.duck";
import { actions as locationsActions } from "../../../../store/ducks/locations.duck";
import { actions as authActions } from "../../../../store/ducks/auth.duck";
import { actions as usersActions } from "../../../../store/ducks/users.duck";
import { actions as tariffsActions } from "../../../../store/ducks/tariffs.duck";

import useStyles from "../../styles";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import { ILocationToRequest, ILocation } from "../../../../interfaces/locations";
import AutocompleteLocations from "../../../../components/AutocompleteLocations";
import { IAppState } from "../../../../store/rootDuck";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";
import { Skeleton } from "@material-ui/lab";
import { IUser } from "../../../../interfaces/users";
import { ITariff } from "../../../../interfaces/tariffs";

const innerStyles = makeStyles((theme: Theme) => ({
  group: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    border: "1px solid",
    borderColor: "#e0e0e0",
    borderRadius: 4,
  },
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
  fetchMe,
  me,
  loadingMe,
  errorMe,

  fetchUser,
  user,
  loadingUser,
  errorUser,

  clearEdit,
  edit,
  editLoading,
  editSuccess,
  editError,

  intl,
  editMode,
  userId,
  prompterRunning,
  prompterStep,

  fetchTariffs,
  tariffs,
}) => {
  const innerClasses = innerStyles();
  const classes = useStyles();

  let realUser: IUser | undefined = undefined;
  if (editMode === "profile" && me) realUser = me;
  if ((editMode === "edit" || editMode === "view") && user) realUser = user;

  let realTariffs: ITariff[] | undefined = undefined;
  if (tariffs && realUser) {
    if (realUser.is_admin) {
      realTariffs = tariffs.filter(item => item.role === "ROLE_ADMIN");
    }
    if (realUser.is_vendor) {
      realTariffs = tariffs.filter(item => item.role === "ROLE_VENDOR");
    }
    if (realUser.is_buyer) {
      realTariffs = tariffs.filter(item => item.role === "ROLE_BUYER");
    }
  }

  const [creatingLocation, setCreatingLocation] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState(-1);
  const [autoLocation, setAutoLocation] = useState({ text: "" });

  const {
    values,
    handleChange,
    resetForm,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      tariff_id: realUser?.tariff.id,
      crop_ids: realUser?.crops ? Array.from(realUser?.crops, x => x.id) : [],
    },
    onSubmit: () => {
      console.log(values);
      if (realUser && values.tariff_id) {
        edit({
          id: realUser?.id,
          data: { tariff_id: values.tariff_id, crop_ids: values.crop_ids },
        });
      }
    },
  });

  useEffect(() => {
    if (realUser) {
      resetForm({
        values: {
          tariff_id: realUser?.tariff.id,
          crop_ids: realUser?.crops ? Array.from(realUser?.crops, x => x.id) : [],
        },
      });
    }
  }, [realUser, resetForm, tariffs]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (editSuccess || editError) {
      enqueueSnackbar(
        editSuccess
          ? intl.formatMessage({ id: "NOTISTACK.TARIFF.EDIT" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editError}`,
        {
          variant: editSuccess ? "success" : "error",
        }
      );
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
    if (!tariffs) fetchTariffs();
  }, [fetchTariffs, tariffs]);

  console.log("values:", values);

  return (
    <div>
      {loadingMe || loadingUser || !realTariffs || !realUser ? (
        <Skeleton width="100%" height={70} animation="wave" />
      ) : (
        <TextField
          select
          type="text"
          label={intl.formatMessage({
            id: "USER.EDIT_FORM.TARIFFS",
          })}
          margin="normal"
          className={classes.textField}
          value={values.tariff_id}
          name="tariff_id"
          variant="outlined"
          onChange={e => {
            setFieldValue("tariff_id", e.target.value);
            handleSubmit();
          }}
          helperText={touched.tariff_id && errors.tariff_id}
          error={Boolean(touched.tariff_id && errors.tariff_id)}
          disabled={!me?.is_admin || editMode === "profile"}
        >
          {realTariffs.map(item => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
      )}
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

    editLoading: state.users.editLoading,
    editSuccess: state.users.editSuccess,
    editError: state.users.editError,

    prompterRunning: state.prompter.running,
    prompterStep: state.prompter.activeStep,

    tariffs: state.tariffs.tariffs,
  }),
  {
    fetchMe: authActions.fetchRequest,
    fetchUser: usersActions.fetchByIdRequest,

    fetchTariffs: tariffsActions.fetchRequest,

    clearEdit: usersActions.clearEdit,
    edit: usersActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(LocationsForm));
