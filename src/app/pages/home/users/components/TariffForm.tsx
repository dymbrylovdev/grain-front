import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import {
  Typography,
  TextField,
  Theme,
  Grid as div,
  Button,
  MenuItem,
  Dialog,
} from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import { actions as builderActions } from "../../../../../_metronic/ducks/builder";
import { actions as authActions } from "../../../../store/ducks/auth.duck";
import { actions as usersActions } from "../../../../store/ducks/users.duck";
import { actions as tariffsActions } from "../../../../store/ducks/tariffs.duck";
import { actions as crops2Actions } from "../../../../store/ducks/crops2.duck";

import TariffTable from "./TariffTable";
import NewTariffTable from "./NewTariffTable";
import TariffPaymentBlock from "./TariffPaymentBlock";
import useStyles from "../../styles";
import { IAppState } from "../../../../store/rootDuck";
import { Skeleton } from "@material-ui/lab";
import { IUser } from "../../../../interfaces/users";
import { ITariff, ITariffType, ITariffPeriod } from "../../../../interfaces/tariffs";
import { ICrop } from "../../../../interfaces/crops";
import getMenuConfig from "../../../../router/MenuConfig";
import DateFnsUtils from "@date-io/date-fns";
import ruRU from "date-fns/locale/ru";
import { accessByRoles } from "../../../../utils/utils";
import uniqBy from "lodash/uniqBy";

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
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 16,
    fontWeight: 400,
    color: "#000000",
    opacity: 0.87,
  },
  calendarContain: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  calendarBlock: {
    maxWidth: 250,
  },
  buttonsBottomContain: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
  tariffPriceBlock: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
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
  let realBuyerTariffs: ITariff[] | undefined = undefined;
  let groupedTariffsType: ITariffType[] | undefined = undefined;
  let groupedTariffsPeriod: ITariffPeriod[] | undefined = undefined;
  let groupedForBuyer: ITariffType[] | undefined = undefined;

  if (tariffs && realUser) {
    realTariffs = tariffs.filter(item => item.role.name === realUser?.roles[0]);

    realBuyerTariffs = tariffs.filter(
      item => item.role.name === "ROLE_BUYER" || item.role.name === "ROLE_TRADER"
    );

    let a = realTariffs.map(item => item.tariff);
    groupedTariffsType = uniqBy(a, n => n.name);

    let b = realTariffs.map(item => item.tariff_period);
    //@ts-ignore
    b.includes(null)
      ? (groupedTariffsPeriod = b)
      : (groupedTariffsPeriod = uniqBy(b, n => n.period));

    let c = realBuyerTariffs.map(item => item.tariff);
    groupedForBuyer = uniqBy(c, n => n.name);
  }

  let realCrops: ICrop[] = [];
  if (crops) {
    crops.forEach(crop => {
      if (!realUser?.crops.find(item => item.id === crop.id)) {
        realCrops.push(crop);
      }
    });
  }

  // const [addingCrop, setAddingCrop] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [showTariffTable, setShowTariffTable] = useState(true);

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const { values, resetForm, handleSubmit, errors, touched, setFieldValue } = useFormik({
    initialValues: {
      tariff_id: realUser?.tariff_matrix.id,
      tariff_type_id: realUser?.tariff_matrix.tariff.id,
      tariff_period_id: realUser?.tariff_matrix.tariff_period
        ? realUser?.tariff_matrix.tariff_period.id
        : undefined,
      crop_ids: realUser?.crops ? Array.from(realUser?.crops, x => x.id) : [],
      tariff_expired_at: new Date(),
    },
    onSubmit: () => {
      let newCropIds = [...values.crop_ids];
      // let selectedTariff = tariffs?.find(
      //   tariff =>
      //     tariff.tariff.id === values.tariff_type_id &&
      //     tariff.tariff_period.id === values.tariff_period_id
      // );
      let newTariffExpiredDate = selectedDate;
      if (
        values.crop_ids &&
        values.tariff_id &&
        values.tariff_type_id &&
        values.tariff_period_id &&
        tariffs &&
        realSelectedTariff &&
        values.crop_ids.length > realSelectedTariff.max_crops_count
      ) {
        newCropIds.splice(realSelectedTariff.max_crops_count);
      }
      if (
        realSelectedTariff?.id &&
        realUser?.tariff_matrix?.id &&
        [1, 2, 102].includes(realUser.tariff_matrix.id) &&
        [3, 4, 5].includes(realSelectedTariff.id) &&
        crops
      ) {
        newCropIds = Array.from(crops, x => x.id);
        newCropIds.splice(realSelectedTariff.max_crops_count);
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
              tariff_matrix_id: realSelectedTariff?.id,
              crop_ids: newCropIds,
              tariff_expired_at: newTariffExpiredDate,
            },
          });
        }
      }
    },
  });

  let realSelectedTariff: ITariff | undefined = undefined;
  if (realTariffs && realUser) {
    if (!["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0])) {
      ["ROLE_BUYER"].includes(realUser.roles[0])
        ? (realSelectedTariff = realBuyerTariffs?.find(
            tariff =>
              tariff.tariff.id === values.tariff_type_id &&
              tariff.tariff_period.id === values.tariff_period_id
          ))
        : (realSelectedTariff = realTariffs?.find(
            tariff =>
              tariff.tariff.id === values.tariff_type_id &&
              tariff.tariff_period.id === values.tariff_period_id
          ));
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
          tariff_expired_at: selectedDate,
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
        {!me ||
        loadingMe ||
        loadingUser ||
        !realTariffs ||
        !realBuyerTariffs ||
        !realSelectedTariff ||
        !groupedTariffsType ||
        !groupedTariffsPeriod ||
        !groupedForBuyer ||
        !realUser ||
        editLoading ? (
          <Skeleton width="100%" height={68} animation="wave" />
        ) : (
          <>
            {editMode === "profile" && (
              <>
                {showTariffTable ? (
                  <NewTariffTable me={me} classes={classes} showTariffTable={showTariffTable} setShowTariffTable={setShowTariffTable} />
                ) : (
                  <div>123</div>
                )}
              </>
            )}

            {/* {!["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0]) && (
              <div style={{ marginTop: 30, marginBottom: 10 }}>
                <h6 className={innerClasses.title}>
                  Текущий тариф: {realUser?.tariff_matrix.tariff.name}
                </h6>
                <h6 className={innerClasses.title}>{`Окончание действия тарифа: ${intl.formatDate(
                  realUser?.tariff_expired_at
                )}`}</h6>
                {realUser?.tariff_matrix.tariff.name !== "Бесплатный" ? (
                  <h6 className={innerClasses.title}>
                    Срок действия тарифа: {realUser?.tariff_matrix.tariff_period.period}
                  </h6>
                ) : null}
              </div>
            )} */}

            {/* <div>
              {!["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0]) &&
                realSelectedTariff.tariff.name !== "Бесплатный" && (
                  <div className={innerClasses.calendarContain}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruRU}>
                      <div className={innerClasses.calendarBlock}>
                        <KeyboardDatePicker
                          variant="dialog"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="data-picker-dialog"
                          label={intl.formatMessage({ id: "TARIFFS.DATE.PICKER" })}
                          value={selectedDate}
                          onChange={handleDateChange}
                        ></KeyboardDatePicker>
                      </div>
                    </MuiPickersUtilsProvider>
                  </div>
                )}

              <TextField
                select
                type="text"
                label={intl.formatMessage({
                  id: "USER.EDIT_FORM.TARIFFS",
                })}
                margin="normal"
                className={classes.textField}
                value={values.tariff_type_id}
                name="tariff_type_id"
                variant="outlined"
                onChange={e => {
                  setFieldValue("tariff_type_id", e.target.value);
                }}
                helperText={touched.tariff_type_id && errors.tariff_type_id}
                error={Boolean(touched.tariff_type_id && errors.tariff_type_id)}
              >
                {!["ROLE_BUYER"].includes(realUser.roles[0])
                  ? groupedTariffsType.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))
                  : groupedForBuyer.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
              </TextField>

              {!["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0]) &&
                realSelectedTariff.tariff.name !== "Бесплатный" && (
                  <TextField
                    select
                    type="text"
                    label={intl.formatMessage({ id: "TARIFFS.DURATION" })}
                    margin="normal"
                    className={classes.textField}
                    value={values.tariff_period_id ? values.tariff_period_id : 0}
                    name="tariff_period_id"
                    variant="outlined"
                    onChange={e => {
                      setFieldValue("tariff_period_id", e.target.value);
                    }}
                    helperText={touched.tariff_period_id && errors.tariff_period_id}
                    error={Boolean(touched.tariff_period_id && errors.tariff_period_id)}
                  >
                    {groupedTariffsPeriod.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.period}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

              {editMode === "profile" &&
                !["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0]) && (
                  <div className={innerClasses.tariffPriceBlock}>
                    {realSelectedTariff.tariff.name !== "Бесплатный" && (
                      <Typography variant="h6">
                        Стоимость тарифа: <b>{realSelectedTariff.price}</b>
                      </Typography>
                    )}
                  </div>
                )}
            </div> */}
          </>
        )}
      </div>
      {realUser && realSelectedTariff && (
        <div className={innerClasses.buttonsBottomContain}>
          <Button variant="contained" color="primary">
            <a
              style={{ color: "#FFF" }}
              href="https://drive.google.com/drive/folders/1fajBzWbprZShBTjoDp2JN-Xw4K6VHwKL"
              target="blank"
            >
              Скачать договор
            </a>
          </Button>
          {/* {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && (
            <Button style={{ marginLeft: 15 }} variant="contained" color="primary" onClick={() => handleSubmit()}>
              {intl.formatMessage({ id: "TARIFFS.SAVE" })}
            </Button>
          )}
          {accessByRoles(me, ["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"]) &&
            realSelectedTariff.tariff.name !== "Бесплатный" && (
              <Button style={{ marginLeft: 15 }} variant="contained" color="primary" onClick={() => onToggleModal()}>
                {intl.formatMessage({ id: "TARIFFS.PAYMENT" })}
              </Button>
            )} */}
        </div>
      )}

      {realUser &&
        realSelectedTariff &&
        me &&
        groupedTariffsType &&
        tariffs &&
        !["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0]) && (
          <TariffPaymentBlock realUser={realUser} openModal={openModal} setOpenModal={setOpenModal} />
        )}
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
