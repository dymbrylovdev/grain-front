import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import {
  TextField,
  Theme,
  IconButton,
  Grid as div,
  Button,
  MenuItem,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSnackbar } from "notistack";

import { actions as builderActions } from "../../../../../_metronic/ducks/builder";
import { actions as authActions } from "../../../../store/ducks/auth.duck";
import { actions as usersActions } from "../../../../store/ducks/users.duck";
import { actions as tariffsActions } from "../../../../store/ducks/tariffs.duck";
import { actions as crops2Actions } from "../../../../store/ducks/crops2.duck";

import useStyles from "../../styles";
import { IAppState } from "../../../../store/rootDuck";
import { Skeleton, Autocomplete } from "@material-ui/lab";
import { IUser } from "../../../../interfaces/users";
import { ITariff } from "../../../../interfaces/tariffs";
import { ICrop } from "../../../../interfaces/crops";
import getMenuConfig from "../../../../router/MenuConfig";

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

  title: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
  crop: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 43.5,
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
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

  clearEditMe,
  editMe,
  editMeLoading,
  editMeSuccess,
  editMeError,

  intl,
  editMode,
  userId,
  prompterRunning,
  prompterStep,

  fetchTariffs,
  tariffs,

  fetchCrops,
  crops,

  setMenuConfig,
}) => {
  const innerClasses = innerStyles();
  const classes = useStyles();

  let realUser: IUser | undefined = undefined;
  if (editMode === "profile" && me) realUser = me;
  if ((editMode === "edit" || editMode === "view") && user) realUser = user;

  let realTariffs: ITariff[] | undefined = undefined;
  if (tariffs && realUser) {
    realTariffs = tariffs.filter(item => item.role === realUser?.roles[0]);
  }

  let realCrops: ICrop[] = [];
  if (crops) {
    crops.forEach(crop => {
      if (!realUser?.crops.find(item => item.id === crop.id)) {
        realCrops.push(crop);
      }
    });
  }

  const [addingCrop, setAddingCrop] = useState(false);

  const { values, resetForm, handleSubmit, errors, touched, setFieldValue } = useFormik({
    initialValues: {
      tariff_id: realUser?.tariff.id,
      crop_ids: realUser?.crops ? Array.from(realUser?.crops, x => x.id) : [],
    },
    onSubmit: () => {
      let newCropIds = [...values.crop_ids];
      let selectedTariff = tariffs?.find(tariff => tariff.id === values.tariff_id);
      if (
        values.crop_ids &&
        values.tariff_id &&
        tariffs &&
        selectedTariff &&
        values.crop_ids.length > selectedTariff.max_crops_count
      ) {
        newCropIds.splice(selectedTariff.max_crops_count);
      }
      if (realUser && values.tariff_id) {
        if (editMode === "profile") {
          editMe({
            data: { crop_ids: newCropIds },
          });
        } else {
          edit({
            id: realUser?.id,
            data: { tariff_id: values.tariff_id, crop_ids: newCropIds },
          });
        }
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
    if (me) setMenuConfig(getMenuConfig(me.crops, me));
  }, [me, setMenuConfig]);

  useEffect(() => {
    fetchTariffs();
  }, [fetchTariffs]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  return (
    <>
      <div>
        {!me || loadingMe || loadingUser || !realTariffs || !realUser || editLoading ? (
          <Skeleton width="100%" height={68} animation="wave" />
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
            disabled={
              !["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0]) ||
              ["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0]) ||
              editMode === "profile"
            }
          >
            {realTariffs.map(item => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </div>
      <div className={classes.box}>
        <div className={innerClasses.title}>{intl.formatMessage({ id: "TARIFFS.CROPS" })}</div>
        {loadingMe || loadingUser || !realTariffs || !realUser || editLoading ? (
          <>
            <Skeleton width="100%" height={52.5} animation="wave" />
            <Skeleton width="100%" height={52.5} animation="wave" />
            {/* <Skeleton width="100%" height={40} animation="wave" /> */}
          </>
        ) : realUser.crops.length ? (
          realUser.crops.map(item => (
            <div key={item.id}>
              <div className={innerClasses.crop}>
                <div>{item.name}</div>
                <IconButton
                  size={"medium"}
                  onClick={() => {
                    let newCropIds = [...values.crop_ids];
                    newCropIds.splice(newCropIds.indexOf(item.id), 1);
                    setFieldValue("crop_ids", newCropIds);
                    handleSubmit();
                  }}
                  color="secondary"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              <Divider />
            </div>
          ))
        ) : (
          <div>
            <div className={innerClasses.crop}>
              {intl.formatMessage({ id: "TARIFFS.NO_CROPS" })}
            </div>
            <Divider />
          </div>
        )}
        {loadingMe || loadingUser || !realTariffs || !realUser || editLoading ? (
          <>
            <Skeleton width="100%" height={51.5} animation="wave" />
          </>
        ) : (
          <div className={innerClasses.crop}>
            {!!realUser?.crops &&
            !!realUser?.tariff &&
            realUser?.crops?.length < realUser?.tariff?.max_crops_count ? (
              <div>{intl.formatMessage({ id: "TARIFFS.MORE_CROPS" })}</div>
            ) : (
              <div>{intl.formatMessage({ id: "TARIFFS.NO_MORE_CROPS" })}</div>
            )}
          </div>
        )}
        {!!realUser?.crops &&
          !!realUser?.tariff &&
          realUser?.crops?.length < realUser?.tariff?.max_crops_count && (
            <div className={classes.textFieldContainer}>
              {!addingCrop ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setAddingCrop(true)}
                  disabled={loadingMe || loadingUser || editLoading}
                >
                  {intl.formatMessage({ id: "CROPSLIST.BUTTON.CREATE" })}
                </Button>
              ) : (
                <div className={classes.textField}>
                  <Autocomplete
                    id="crops"
                    options={realCrops}
                    getOptionLabel={option => option.name}
                    loadingText={intl.formatMessage({ id: "ALL.AUTOCOMPLIT.EMPTY" })}
                    noOptionsText={intl.formatMessage({ id: "ALL.AUTOCOMPLIT.EMPTY" })}
                    onChange={(e: any, val: any) => {
                      let newCropIds = [...values.crop_ids];
                      newCropIds.push(val.id);
                      setFieldValue("crop_ids", newCropIds);
                      handleSubmit();
                      setAddingCrop(false);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        margin="normal"
                        label={intl.formatMessage({ id: "BIDSLIST.TABLE.CROP" })}
                        variant="outlined"
                        onBlur={() => {
                          setAddingCrop(false);
                        }}
                        autoFocus
                      />
                    )}
                  />
                </div>
              )}
            </div>
          )}
      </div>
    </>
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

    editMeLoading: state.auth.editLoading,
    editMeSuccess: state.auth.editSuccess,
    editMeError: state.auth.editError,

    prompterRunning: state.prompter.running,
    prompterStep: state.prompter.activeStep,

    tariffs: state.tariffs.tariffs,

    crops: state.crops2.crops,
  }),
  {
    fetchMe: authActions.fetchRequest,
    fetchUser: usersActions.fetchByIdRequest,
    fetchCrops: crops2Actions.fetchRequest,

    fetchTariffs: tariffsActions.fetchRequest,

    clearEdit: usersActions.clearEdit,
    edit: usersActions.editRequest,
    clearEditMe: authActions.clearEdit,
    editMe: authActions.editRequest,

    setMenuConfig: builderActions.setMenuConfig,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(LocationsForm));
