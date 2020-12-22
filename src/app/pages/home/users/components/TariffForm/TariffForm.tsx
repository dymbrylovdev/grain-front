import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Theme, Grid as div, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import { actions as builderActions } from "../../../../../../_metronic/ducks/builder";
import { actions as authActions } from "../../../../../store/ducks/auth.duck";
import { actions as usersActions } from "../../../../../store/ducks/users.duck";
import { actions as tariffsActions } from "../../../../../store/ducks/tariffs.duck";
import { actions as crops2Actions } from "../../../../../store/ducks/crops2.duck";

import TariffCards from "./components/TariffCards";
import NewTariffTable from "./components/NewTariffTable";
import TariffPaymentBlock from "./components/TariffPaymentBlock";
import useStyles from "../../../styles";
import { IAppState } from "../../../../../store/rootDuck";
import { Skeleton } from "@material-ui/lab";
import { IUser } from "../../../../../interfaces/users";
import { ITariff, ITariffType, ITariffPeriod } from "../../../../../interfaces/tariffs";
import { ICrop } from "../../../../../interfaces/crops";
import getMenuConfig from "../../../../../router/MenuConfig";
import { accessByRoles } from "../../../../../utils/utils";
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
  tariffInfo: {
    fontSize: 18,
    fontWeight: 400,
    marginTop: 20,
    marginBottom: 20,
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

  let realGroupedTariffs: ITariff[] | undefined = undefined;
  let realGroupedBuyerTariffs: ITariff[] | undefined = undefined;

  if (tariffs && realUser) {
    realTariffs = tariffs.filter(item => item.role.name === realUser?.roles[0]);

    realBuyerTariffs = tariffs.filter(
      item => item.role.name === "ROLE_BUYER" || item.role.name === "ROLE_TRADER"
    );

    realGroupedTariffs = realTariffs.filter(item => item.tariff.name !== "Бесплатный");
    realGroupedBuyerTariffs = realBuyerTariffs.filter(
      item => item.tariff.name === "Бизнес/Трейдер"
    );
  }

  let realCrops: ICrop[] = [];
  if (crops) {
    crops.forEach(crop => {
      if (!realUser?.crops.find(item => item.id === crop.id)) {
        realCrops.push(crop);
      }
    });
  }

  const [openModal, setOpenModal] = useState(false);
  const [showTariffTable, setShowTariffTable] = useState(0);
  const [selectedTariff, setSelectedTariff] = useState<ITariff | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { values, resetForm, handleSubmit, errors, touched, setFieldValue } = useFormik({
    initialValues: {
      tariff_id: realUser?.tariff_matrix.id,
      tariff_type_id: realUser?.tariff_matrix.tariff.id,
      tariff_period_id: realUser?.tariff_matrix.tariff_period
        ? realUser?.tariff_matrix.tariff_period.id
        : undefined,
      crop_ids: realUser?.crops ? Array.from(realUser?.crops, x => x.id) : [],
    },
    onSubmit: () => {
      let params: any = {};
      let tariff_matrix_id_for_prolongation = selectedTariff && selectedTariff.id;
      let tariff_matrix_id = selectedTariff && selectedTariff.id;

      let dateToString = selectedDate;
      let tariff_start_date = dateToString.toString();
      let tariff_prolongation_start_date = dateToString.toString();

      if (realUser && realUser.tariff_matrix === null) {
        params = { ...params, tariff_matrix_id, tariff_start_date }
      }

      if (realUser && realUser.tariff_matrix.tariff.name === "Бесплатный") {
        params = { ...params, tariff_matrix_id_for_prolongation, tariff_start_date };
      } else {
        params = { ...params, tariff_matrix_id_for_prolongation, tariff_prolongation_start_date }
      }

      if (realUser && values.tariff_id) {
        edit({
          id: realUser?.id,
          data: params,
        });
      }
    },
  });

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
        !realUser ||
        editLoading ? (
          <Skeleton width="100%" height={68} animation="wave" />
        ) : (
          <>
            {(editMode === "profile" || editMode === "edit") && (
              <>
                <div className={innerClasses.tariffInfo}>
                  <div>
                    Текущий тариф:{" "}
                    {realUser.tariff_matrix.tariff.name === "Бизнес/Трейдер"
                      ? "Бизнес"
                      : realUser.tariff_matrix.tariff.name}
                  </div>
                  {realUser.tariff_matrix.tariff.name !== "Бесплатный" ? (
                    <div>
                      Период действия тарифа: {realUser.tariff_matrix.tariff_period.period} дней
                    </div>
                  ) : null}
                  {realUser.tariff_matrix.tariff.name !== "Бесплатный" ? (
                    <div>Дата окончания тарифа: {intl.formatDate(realUser.tariff_expired_at)}</div>
                  ) : null}
                </div>

                {realUser.tariff_prolongations.length ? (
                  <Alert className={classes.infoAlert} severity="info" color="info">
                    Вам будет доступен тариф{" "}
                    {realUser.tariff_prolongations[0].tariff_matrix.tariff.name}{" "}
                    {realUser.tariff_prolongations[0].tariff_matrix.tariff_period.period}
                    {". "}
                    Дата начала действия тарифа{" "}
                    {intl.formatDate(realUser.tariff_prolongations[0].start_date)}
                  </Alert>
                ) : null}

                {!showTariffTable ? (
                  <NewTariffTable
                    me={me}
                    classes={classes}
                    editMode={editMode}
                    realUser={realUser}
                    showTariffTable={showTariffTable}
                    setShowTariffTable={setShowTariffTable}
                  />
                ) : (
                  <TariffCards
                    me={me}
                    edit={handleSubmit}
                    editMode={editMode}
                    realGroupedTariffs={realGroupedTariffs}
                    realGroupedBuyerTariffs={realGroupedBuyerTariffs}
                    showTariffTable={showTariffTable}
                    setShowTariffTable={setShowTariffTable}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    selectedTariff={selectedTariff}
                    setSelectedTariff={setSelectedTariff}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      {realUser && (
        <div className={innerClasses.buttonsBottomContain}>
          <Button variant="contained" color="primary">
            <a
              style={{ color: "#FFF" }}
              href="https://drive.google.com/drive/folders/1fajBzWbprZShBTjoDp2JN-Xw4K6VHwKL"
              target="blank"
            >
              {intl.formatMessage({ id: "ALL_BUTTONS.DOWNLOAD" })}
            </a>
          </Button>
        </div>
      )}

      {realUser && (
        <TariffPaymentBlock
          realUser={realUser}
          openModal={openModal}
          setOpenModal={setOpenModal}
          selectedTariff={selectedTariff}
          selectedDate={selectedDate}
        />
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
