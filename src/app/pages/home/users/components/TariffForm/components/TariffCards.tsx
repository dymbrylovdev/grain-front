import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Grid as div,
  Theme,
} from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { injectIntl, IntlShape, WrappedComponentProps } from "react-intl";

import { makeStyles } from "@material-ui/styles";

import { ITariff } from "../../../../../../interfaces/tariffs";
import { IUser } from "../../../../../../interfaces/users";
import DateFnsUtils from "@date-io/date-fns";
import ruRU from "date-fns/locale/ru";

// 660px

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // display: "flex",
    // justifyContent: "space-between",
  },
  cardContain: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    [theme.breakpoints.up("sm")]: {
      flexWrap: "nowrap",
      justifyContent: "space-between",
    },
  },
  card: {
    width: "40%",
    margin: 5,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
  },
  button: {
    width: "100%",
  },
  calendarContain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calendarBlock: {
    maxWidth: 250,
  },
}));

interface IProps {
  intl: IntlShape;
  me: IUser;
  edit: any;
  editMode: "profile" | "edit" | "view" | "create";
  realGroupedTariffs: ITariff[] | undefined;
  realGroupedBuyerTariffs: ITariff[] | undefined;

  showTariffTable: number;
  setShowTariffTable: any;

  openModal: boolean;
  setOpenModal: any;

  selectedTariff: ITariff | undefined;
  setSelectedTariff: any;

  selectedDate: any;
  setSelectedDate: any;
}

const TariffCards: React.FC<IProps & WrappedComponentProps> = ({
  intl,
  me,
  edit,
  editMode,
  realGroupedTariffs,
  realGroupedBuyerTariffs,

  showTariffTable,
  setShowTariffTable,

  openModal,
  setOpenModal,

  selectedTariff,
  setSelectedTariff,

  selectedDate,
  setSelectedDate,
}) => {
  const innerClasses = useStyles();

  const handleSubmit = tariff => {
    setSelectedTariff(tariff);
    !["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0]) ? setOpenModal(true) : edit();
  };

  const showRequisites = tariff => {
    setSelectedTariff(tariff);
    setOpenModal(true);
  };

  return (
    <div className={innerClasses.root}>
      <div style={{ marginBottom: 15, marginLeft: 5 }}>
        <div className={innerClasses.calendarContain}>
          <Button onClick={() => setShowTariffTable(0)} variant="outlined" color="primary">
            {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
          </Button>

          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruRU}>
            <div className={innerClasses.calendarBlock}>
              <KeyboardDatePicker
                variant="dialog"
                format="dd/MM/yyyy"
                margin="normal"
                id="data-picker-dialog"
                label={intl.formatMessage({ id: "TARIFFS.DATE.PICKER" })}
                value={selectedDate}
                onChange={e => setSelectedDate(e)}
              ></KeyboardDatePicker>
            </div>
          </MuiPickersUtilsProvider>
        </div>
      </div>

      <div className={innerClasses.cardContain}>
        {showTariffTable === 1 &&
          realGroupedTariffs?.map(item => (
            <Card className={innerClasses.card} key={item.id}>
              <CardContent>
                <div className={innerClasses.title}>{item.tariff.name}</div>
                <div>{item.tariff_period.period} Дней</div>
                <div className={innerClasses.title} style={{ marginTop: 20 }}>
                  {item.price} руб.
                </div>
              </CardContent>
              <Divider />
              <CardActions>
                <div style={{width: '100%'}}>
                  <Button
                    onClick={() => handleSubmit(item)}
                    className={innerClasses.button}
                    variant="contained"
                    color="primary"
                  >
                    {!["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0])
                      ? intl.formatMessage({ id: "TARIFFS.PAYMENT.PAY" })
                      : intl.formatMessage({ id: "TARIFFS.PAYMENT.SET" })}
                  </Button>

                  {editMode === "edit" && (
                    <Button
                      onClick={() => showRequisites(item)}
                      className={innerClasses.button}
                      variant="contained"
                      color="primary"
                      style={{marginTop: 10}}
                    >
                      {intl.formatMessage({ id: "ALL_BUTTONS.REQUSITES" })}
                    </Button>
                  )}
                </div>
              </CardActions>
            </Card>
          ))}

        {showTariffTable === 2 &&
          realGroupedBuyerTariffs?.map(item => (
            <Card className={innerClasses.card} key={item.id}>
              <CardContent>
                <div className={innerClasses.title}>{item.tariff.name}</div>
                <div>{item.tariff_period.period} Дней</div>
                <div className={innerClasses.title} style={{ marginTop: 10 }}>
                  {item.price} руб.
                </div>
              </CardContent>
              <Divider />
              <CardActions>
                <div>
                  <Button
                    onClick={() => handleSubmit(item)}
                    className={innerClasses.button}
                    variant="contained"
                    color="primary"
                  >
                    {!["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0])
                      ? intl.formatMessage({ id: "TARIFFS.PAYMENT.PAY" })
                      : intl.formatMessage({ id: "TARIFFS.PAYMENT.SET" })}
                  </Button>

                  {editMode === "edit" && (
                    <Button
                      onClick={() => showRequisites(item)}
                      className={innerClasses.button}
                      variant="contained"
                      color="primary"
                      style={{marginTop: 10}}
                    >
                      {intl.formatMessage({ id: "ALL_BUTTONS.REQUSITES" })}
                    </Button>
                  )}
                </div>
              </CardActions>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default injectIntl(TariffCards);
