import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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

  calendarContain: {
    display: "flex",
    justifyContent: "space-between",
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
  let groupedTariffsType: ITariffType[] | undefined = undefined;
  let groupedTariffsPeriod: ITariffPeriod[] | undefined = undefined;
  if (tariffs && realUser) {
    realTariffs = tariffs.filter(item => item.role.name === realUser?.roles[0]);

    let a = realTariffs.map(item => item.tariff);
    groupedTariffsType = uniqBy(a, n => n.name);

    let b = realTariffs.map(item => item.tariff_period);
    //@ts-ignore
    b.includes(null)
      ? (groupedTariffsPeriod = b)
      : (groupedTariffsPeriod = uniqBy(b, n => n.period));
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

  const onToggleModal = () => {
    setOpenModal(!openModal);
  };

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
          tariff_expired_at: selectedDate,
        },
      });
    }
  }, [realUser, resetForm, tariffs, selectedDate]);

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
        !realSelectedTariff ||
        !groupedTariffsType ||
        !groupedTariffsPeriod ||
        !realUser ||
        editLoading ? (
          <Skeleton width="100%" height={68} animation="wave" />
        ) : (
          <>
            <div className={classes.table}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                      <b>{intl.formatMessage({ id: "TARIFFS.NAME.FREE" })}</b>
                    </TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                      <b>{intl.formatMessage({ id: "TARIFFS.NAME.PREMIUM" })}</b>
                    </TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        <b>{intl.formatMessage({ id: "AUTH.REGISTER.TRADER" })}</b>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>Количество публикаций объявлений</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                      Неограниченно
                    </TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                      Неограниченно
                    </TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        Неограниченно
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>Количество активных объявлений</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                      Неограниченно
                    </TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                      Неограниченно
                    </TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        Неограниченно
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>Количество точек отгрузки</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                      Неограниченно
                    </TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                      Неограниченно
                    </TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        Неограниченно
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>Срок публикации заявки</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                      14 дней
                    </TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                      14 дней
                    </TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        14 дней
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>Периодичность подписки</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                      2 раза в неделю (понедельник и среда)
                    </TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                      2 раза в неделю (понедельник и среда)
                    </TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        2 раза в неделю (понедельник и среда)
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>Время получения подписки</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                      6:00 (по Москве)
                    </TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                      6:00 (по Москве)
                    </TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        6:00 (по Москве)
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}></TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}></TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}></TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>Отображение объявлений в списках ваших клиентов</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                      Общие условия
                    </TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                      Приоритетное размещение
                    </TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        Приоритетное размещение
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>Список встречных объявлений с лучшими ценами</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>10</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>10</TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        10
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>Количество культур с которыми можно работать в системе</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>1</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>5</TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        10
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>Количество подписок</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>1</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>5</TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        10
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>Количество просмотров контактов в день</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>8</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>50</TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        80
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>Обращение в службу поддержки</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                      Обращения обрабатываются в течение 24 часов
                    </TableCell>
                    <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                      Обращения обрабатываются в течение 24 часов
                    </TableCell>
                    {!accessByRoles(me, ["ROLE_VENDOR"]) && (
                      <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                        Персональный менеджер
                      </TableCell>
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {!["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0]) &&
              realSelectedTariff.tariff.name === "Премиум" && (
                <div className={innerClasses.calendarContain}>
                  <h6>{`Начало действия тарифа: ${intl.formatDate(
                    realUser?.tariff_expired_at
                  )}`}</h6>
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
              disabled={
                // !["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0]) ||
                ["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0])
                // editMode === "profile"
              }
            >
              {groupedTariffsType.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>

            {!["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0]) &&
              realSelectedTariff.tariff.name === "Премиум" && (
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

            {editMode === "profile" && !["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0]) && (
              <div className={innerClasses.tariffPriceBlock}>
                {realSelectedTariff.tariff.name === "Премиум" && (
                  <Typography variant="h6">
                    Стоимость тарифа: <b>{realSelectedTariff.price}</b>
                  </Typography>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {realUser && realSelectedTariff && (
        <div className={innerClasses.buttonsBottomContain}>
          {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && (
            <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
              {intl.formatMessage({ id: "TARIFFS.SAVE" })}
            </Button>
          )}
          {accessByRoles(me, ["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"]) && (
            <Button variant="contained" color="primary" onClick={() => onToggleModal()}>
              {intl.formatMessage({ id: "TARIFFS.PAYMENT" })}
            </Button>
          )}
        </div>
      )}

      {realUser &&
        realSelectedTariff &&
        me &&
        groupedTariffsType &&
        tariffs &&
        !["ROLE_ADMIN", "ROLE_MANAGER"].includes(realUser.roles[0]) && (
          <Dialog open={openModal} onClose={onToggleModal}>
            <div style={{ padding: 10 }}>
              <h5>{intl.formatMessage({ id: "TARIFFS.PAYMENT.FORM.TITLE" })}</h5>
              <div>
                <h6>
                  <b>Сумма платежа:</b> {realSelectedTariff.price}
                </h6>
                <br />
                <h6>
                  <b>Назначение платежа:</b> Тариф "{realSelectedTariff.tariff.name}{" "}
                  {realSelectedTariff.tariff_period ? realSelectedTariff.tariff_period.period : 0}"
                  для {realUser.email}, id = {realUser.id}{" "}
                  {`Начало действия тарифа: ${intl.formatDate(realUser?.tariff_expired_at)}`}
                </h6>
                <br />
                <h6>
                  <b>Реквизиты для оплаты</b>
                </h6>
                <h6>Полное наименование: ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "АМБАР"</h6>
                <br />
                <h6>Директор: Егиазарова Кристина Суреновна</h6>
                <h6>ОГРН: 1202300046915</h6>
                <h6>ИНН: 2312294751</h6>
                <h6>КПП: 231201001</h6>
                <h6>Наименование банка: Сбербанк(ПАО) , г. Москва</h6>
                <h6>Корреспондентский счет: 30101810400000000225</h6>
                <h6>БИК: 044525225</h6>
                <h6>Расчетный счет: 40702810038000142636</h6>
                <br />
                <h6>Адрес для корреспонденции: 350080 г. Краснодар</h6>
                <h6>
                  Юридический адрес: КРАЙ КРАСНОДАРСКИЙ, г. КРАСНОДАР, УЛИЦА ИМ. ТЮЛЯЕВА, ДОМ 2
                  КОРПУС 2
                </h6>
              </div>
            </div>
          </Dialog>
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
