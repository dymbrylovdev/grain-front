import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Theme, Grid as div, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import { actions as builderActions } from "../../../../../../_metronic/ducks/builder";
import { actions as authActions } from "../../../../../store/ducks/auth.duck";
import { actions as usersActions } from "../../../../../store/ducks/users.duck";
import { actions as tariffsActions } from "../../../../../store/ducks/tariffs.duck";
import { actions as crops2Actions } from "../../../../../store/ducks/crops2.duck";
import { actions as trialActions } from "../../../../../store/ducks/trial.duck";

import TariffCards from "./components/TariffCards";
import NewTariffTable from "./components/NewTariffTable";
// import TariffPaymentDialog from "./components/TariffPaymentDialog";
import useStyles from "../../../styles";
import { IAppState } from "../../../../../store/rootDuck";
import { Skeleton } from "@material-ui/lab";
import { IUser } from "../../../../../interfaces/users";
import { ITariff } from "../../../../../interfaces/tariffs";
import { ICrop } from "../../../../../interfaces/crops";
import getMenuConfig from "../../../../../router/MenuConfig";
import { useHistory } from "react-router-dom";

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
  setSelectedTariff,
  selectedTariff,
  setSelectedDate,
  selectedDate,
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

  fondyCredentialsRequest,
  merchant,

  fetchTariffs,
  tariffs,

  fetchCrops,
  crops,

  setMenuConfig,

  clearTrial,
  fetchTrial,

  trial,
  trialLoading,
  trialSuccess,
  trialError,

  showTariffTable,
  setTariffTable,
}) => {
  const innerClasses = innerStyles();
  const classes = useStyles();
  const history = useHistory();

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
  // const [showTariffTable, setShowTariffTable] = useState(0);

  const goToTariffPurchase = () => {
    me && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0])
      ? history.push(`/user/profile/tariffs/payment/${userId}`)
      : history.push(`/user/profile/tariffs/payment-form`);
  };

  const { values, resetForm, handleSubmit } = useFormik({
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
      let tariff_matrix_id = selectedTariff && selectedTariff.id;
      let tariff_start_date = selectedDate.toString().replace(/\([^]+\)/g, "");

      params = { tariff_matrix_id, tariff_start_date };

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
    // Отправляет 1 если ползователь переходит в свои тарифы (для аналитики)
    if (editMode === "profile" && realUser && ["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"].includes(realUser?.roles[0])) {
      fetchTariffs(1);
    } else {
      fetchTariffs();
    };
  }, [fetchTariffs, realUser, editMode]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  useEffect(() => {
    fetchTrial();
  }, [fetchTrial]);

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
                  {realUser.tariff_matrix.tariff.name !== "Бесплатный" &&
                  realUser.tariff_matrix.tariff_period ? (
                    <div>
                      Период действия тарифа: {realUser.tariff_matrix.tariff_period.period} дней
                    </div>
                  ) : null}
                  {realUser.tariff_matrix.tariff.name !== "Бесплатный" &&
                  realUser.tariff_expired_at ? (
                    <div>Дата окончания тарифа: {intl.formatDate(realUser.tariff_expired_at)}</div>
                  ) : null}
                </div>

                {!!realUser.tariff_prolongations.length ? (
                  <Alert className={classes.infoAlert} severity="info" color="info">
                    Вам будет доступен тариф{" "}
                    {realUser.tariff_prolongations[0].tariff_matrix.tariff.name} на{" "}
                    {realUser.tariff_prolongations[0].tariff_matrix.tariff_period.period} дней
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
                    setShowTariffTable={setTariffTable}
                    tariffs={tariffs}
                  />
                ) : (
                  <TariffCards
                    me={me}
                    edit={handleSubmit}
                    editMode={editMode}
                    realGroupedTariffs={realGroupedTariffs}
                    realGroupedBuyerTariffs={realGroupedBuyerTariffs}
                    showTariffTable={showTariffTable}
                    setShowTariffTable={setTariffTable}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    selectedTariff={selectedTariff}
                    setSelectedTariff={setSelectedTariff}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    goToTariffPurchase={goToTariffPurchase}
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
              href="https://docs.google.com/document/d/1D4cUTqpcZHx_eMXwcvPwL2TOJua-nHTEWI6bSerzgeo/edit?usp=sharing"
              target="blank"
            >
              {intl.formatMessage({ id: "ALL_BUTTONS.DOWNLOAD" })}
            </a>
          </Button>
        </div>
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

    selectedTariff: state.tariffs.selectedTariff,
    selectedDate: state.tariffs.selectedDate,
    merchant: state.tariffs.merchant_id,
    fondyCredentialsLoading: state.tariffs.fondyCredentialsLoading,
    fondyCredentialsSuccess: state.tariffs.fondyCredentialsSuccess,
    fondyCredentialsError: state.tariffs.fondyCredentialsError,

    prompterRunning: state.prompter.running,
    prompterStep: state.prompter.activeStep,

    tariffs: state.tariffs.tariffs,
    showTariffTable: state.tariffs.showTariffTable,

    crops: state.crops2.crops,

    trial: state.trial.trial,
    trialLoading: state.trial.loading,
    trialSuccess: state.trial.success,
    trialError: state.trial.error,
  }),
  {
    fetchMe: authActions.fetchRequest,
    fetchUser: usersActions.fetchByIdRequest,
    fetchCrops: crops2Actions.fetchRequest,

    fetchTariffs: tariffsActions.fetchRequest,
    setSelectedTariff: tariffsActions.setSelectedTariff,
    setSelectedDate: tariffsActions.setSelectedDate,

    clearEdit: usersActions.clearEdit,
    edit: usersActions.editRequest,
    clearEditMe: authActions.clearEdit,
    editMe: authActions.editRequest,

    clearFondyCredentials: tariffsActions.clearFondyCredentials,
    fondyCredentialsRequest: tariffsActions.fondyCredentialsRequest,

    setTariffTable: tariffsActions.setTariffTable,

    setMenuConfig: builderActions.setMenuConfig,

    clearTrial: trialActions.clearFetch,
    fetchTrial: trialActions.fetchRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(LocationsForm));
