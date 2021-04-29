import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { TextField, Theme, IconButton, Grid as div, Button, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import StarIcon from "@material-ui/icons/Star";
import { useFormik } from "formik";
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
import { ITariff, ITariffType, ITariffPeriod } from "../../../../interfaces/tariffs";
import { ICrop } from "../../../../interfaces/crops";
import getMenuConfig from "../../../../router/MenuConfig";
import { accessByRoles } from "../../../../utils/utils";

const innerStyles = makeStyles((theme: Theme) => ({
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

const CropsForm: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({
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
  setTariffTable,
}) => {
  const innerClasses = innerStyles();
  const classes = useStyles();
  const history = useHistory();

  let realUser: IUser | undefined = undefined;
  if (editMode === "profile" && me) realUser = me;
  if ((editMode === "edit" || editMode === "view") && user) realUser = user;

  let realTariffs: ITariff[] | undefined = undefined;
  if (tariffs && realUser) {
    realTariffs = tariffs.filter(item => item.role.name === realUser?.roles[0]);
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
      tariff_id: realUser?.tariff_matrix.id,
      tariff_type_id: realUser?.tariff_matrix.tariff.id,
      tariff_period_id: realUser?.tariff_matrix.tariff_period
        ? realUser?.tariff_matrix.tariff_period.id
        : undefined,
      crop_ids: realUser?.crops ? Array.from(realUser?.crops, x => x.id) : [],
      main_crop_id: realUser?.main_crop ? realUser?.main_crop.id : 0,
    },
    onSubmit: () => {
      let newCropIds = [...values.crop_ids];
      if (
        values.crop_ids &&
        values.tariff_id &&
        values.tariff_type_id &&
        values.tariff_period_id &&
        tariffs &&
        realSelectedTariff &&
        values.crop_ids.length > realSelectedTariff.tariff_limits.max_crops_count
      ) {
        newCropIds.splice(realSelectedTariff.tariff_limits.max_crops_count);
      }
      if (
        realSelectedTariff?.id &&
        realUser?.tariff_matrix?.id &&
        [1, 2, 102].includes(realUser.tariff_matrix.id) &&
        [3, 4, 5].includes(realSelectedTariff.id) &&
        crops
      ) {
        newCropIds = Array.from(crops, x => x.id);
        newCropIds.splice(realSelectedTariff.tariff_limits.max_crops_count);
      }
      if (realUser && values.tariff_id) {
        if (editMode === "profile") {
          editMe({
            data: { crop_ids: newCropIds },
          });
        } else {
          edit({
            id: realUser?.id,
            data: {
              crop_ids: newCropIds,
            },
          });
        }
      }
    },
  });

  const changeMainBidHandler = useCallback(
    (id: number) => {
      if (realUser) {
        if (editMode === "profile") {
          editMe({
            data: { main_crop_id: id },
          });
        } else {
          edit({
            id: realUser?.id,
            data: { main_crop_id: id },
          });
        }
        setFieldValue("main_crop_id", id);
      }
    },
    [editMode, edit, editMe, realUser, setFieldValue]
  );

  let realSelectedTariff: ITariff | undefined = undefined;
  if (realTariffs && realUser) {
    if (!["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0])) {
      realSelectedTariff = realTariffs?.find(
        tariff =>
          tariff.tariff.id === values.tariff_type_id &&
          tariff.tariff_period.id === values.tariff_period_id
      );
    } else {
      realSelectedTariff = realUser.tariff_matrix;
    }
  }

  useEffect(() => {
    if (realUser) {
      resetForm({
        values: {
          tariff_id: realUser?.tariff_matrix.id,
          tariff_type_id: realUser?.tariff_matrix.tariff.id,
          tariff_period_id: realUser?.tariff_matrix.tariff_period
            ? realUser?.tariff_matrix.tariff_period.id
            : undefined,
          crop_ids: realUser?.crops ? Array.from(realUser?.crops, x => x.id) : [],
          main_crop_id: realUser?.main_crop ? realUser?.main_crop.id : 0,
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

  // console.log(editMode)

  return (
    <>
      <div className={classes.box}>
        <div className={innerClasses.title}>{intl.formatMessage({ id: "TARIFFS.CROPS" })}</div>
        {loadingMe || loadingUser || !realTariffs || !realUser || editLoading ? (
          <>
            <Skeleton width="100%" height={52.5} animation="wave" />
            <Skeleton width="100%" height={52.5} animation="wave" />
          </>
        ) : realUser.crops.length ? (
          realUser.crops.map(item => (
            <div key={item.id}>
              <div className={innerClasses.crop}>
                <div>{item.name}</div>
                {(editMode !== "view" ||
                  (me && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0]))) && (
                  <div>
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

                    <IconButton
                      size={"medium"}
                      onClick={() => changeMainBidHandler(item.id)}
                      color={values.main_crop_id === item.id ? "primary" : "inherit"}
                    >
                      <StarIcon />
                    </IconButton>
                  </div>
                )}
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
        {loadingMe || loadingUser || !realTariffs || !realUser || editLoading || !crops ? (
          <>
            <Skeleton width="100%" height={51.5} animation="wave" />
          </>
        ) : (
          <>
            {editMode !== "view" && (
              <div className={innerClasses.crop}>
                {!!crops &&
                !!realUser?.crops &&
                !!realUser?.tariff_matrix &&
                realUser?.crops?.length < realUser?.tariff_matrix?.tariff_limits.max_crops_count &&
                realUser?.crops?.length < crops.length ? (
                  <div>{intl.formatMessage({ id: "TARIFFS.MORE_CROPS" })}</div>
                ) : (
                  <div>{intl.formatMessage({ id: "TARIFFS.NO_MORE_CROPS" })}</div>
                )}
              </div>
            )}
          </>
        )}
        {!!crops &&
          !!realUser?.crops &&
          !!realUser?.tariff_matrix &&
          realUser?.crops?.length < crops.length && (
            <div className={classes.textFieldContainer}>
              {!addingCrop ? (
                <>
                  {(realUser?.crops?.length <
                    realUser?.tariff_matrix?.tariff_limits.max_crops_count &&
                    editMode === "view" &&
                    accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"])) ||
                    (((realUser?.crops?.length <
                      realUser?.tariff_matrix?.tariff_limits.max_crops_count &&
                      editMode === "edit") ||
                      editMode === "profile") && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setAddingCrop(true)}
                        disabled={loadingMe || loadingUser || editLoading}
                      >
                        {intl.formatMessage({ id: "CROPSLIST.BUTTON.CREATE" })}
                      </Button>
                    ))}

                  {editMode !== "view" &&
                    accessByRoles(me, ["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"]) &&
                    me &&
                    me.tariff_matrix.tariff.name === "Бесплатный" && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setTariffTable(1);
                          history.push(`/user/profile/tariffs`);
                        }}
                        style={{ marginLeft: 15 }}
                        disabled={loadingMe || loadingUser || editLoading}
                      >
                        {intl.formatMessage({ id: "BID.PRICES.GET.PREMIUM" })}
                      </Button>
                    )}
                </>
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

    setTariffTable: tariffsActions.setTariffTable,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(CropsForm));
