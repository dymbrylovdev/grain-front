import React from "react";
import { Card, CardContent, CardActions, Button, Divider, Grid as div } from "@material-ui/core";
import { injectIntl, IntlShape, WrappedComponentProps } from "react-intl";

import { makeStyles } from "@material-ui/styles";

import { ITariff } from "../../../../../../interfaces/tariffs";
import { IUser } from "../../../../../../interfaces/users";
import { accessByRoles } from "../../../../../../utils/utils";

const useStyles = makeStyles({
  root: {
    // display: "flex",
    // justifyContent: "space-between",
  },
  cardContain: {
    display: "flex",
    justifyContent: "space-between",
  },
  card: {
    width: "100%",
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
});

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
}) => {
  const innerClasses = useStyles();

  const handleSubmit = tariff => {
    setSelectedTariff(tariff);
    !["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0])
      ? setOpenModal(true)
      : edit()
  };

  return (
    <div className={innerClasses.root}>
      <div style={{ marginBottom: 15, marginLeft: 5 }}>
        <Button onClick={() => setShowTariffTable(0)} variant="outlined" color="primary">
          {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
        </Button>
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
              </CardActions>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default injectIntl(TariffCards);
