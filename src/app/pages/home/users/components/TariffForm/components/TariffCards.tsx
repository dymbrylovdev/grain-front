import React, { useState } from "react";
import { Card, CardContent, CardActions, Button, Divider, Grid as div } from "@material-ui/core";
import { injectIntl, IntlShape, WrappedComponentProps } from "react-intl";

import TariffPaymentBlock from "./TariffPaymentBlock";
import { makeStyles } from "@material-ui/styles";
import { ITariff } from "../../../../../../interfaces/tariffs";
import { IUser } from "../../../../../../interfaces/users";

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
  },
  title: {
    fontSize: 16,
  },
  button: {
    width: "100%",
  },
});

interface IProps {
  intl: IntlShape;
  me: IUser;
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
    setOpenModal(true);
  };

  return (
    <div className={innerClasses.root}>
      <div style={{ marginBottom: 10 }}>
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
                  Выбрать
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
                  Выбрать
                </Button>
              </CardActions>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default injectIntl(TariffCards);
