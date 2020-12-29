import React from "react";
import { Grid as div } from "@material-ui/core";
import { injectIntl, IntlShape, WrappedComponentProps } from "react-intl";
import { Skeleton } from "@material-ui/lab";

import { makeStyles } from "@material-ui/styles";

import { IUser } from "../../../../../../interfaces/users";
import { ITariff } from "../../../../../../interfaces/tariffs";

const useStyles = makeStyles({
  titleContain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContain: {
    paddingTop: 0,
    paddingRight: 15,
    paddingBottom: 20,
    paddingLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    paddingBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 500,
    paddingTop: 5,
    paddingBottom: 5,
  },
  span: {
    fontWeight: 500,
  },
});

interface IProps {
  intl: IntlShape;
  realUser: IUser;
  selectedTariff: ITariff | undefined;
  selectedDate: Date;
}

const CashlessPayment: React.FC<IProps & WrappedComponentProps> = ({
  intl,
  realUser,
  selectedTariff,
  selectedDate,
}) => {
  const innerClasses = useStyles();

  return (
    <div>
      {!selectedTariff || !realUser ? (
        <Skeleton width="100%" height={68} animation="wave" />
      ) : (
        <>
          <div className={innerClasses.textContain}>
            <div className={innerClasses.titleContain}>
              <div className={innerClasses.title}>
                {intl.formatMessage({ id: "TARIFFS.PAYMENT.FORM.TITLE" })}
              </div>
            </div>
            <div className={innerClasses.subTitle}>
              {intl.formatMessage({ id: "TARIFFS.PAYMENT.COST" })} {selectedTariff.price}
            </div>
            <div>
              {intl.formatMessage({ id: "TARIFFS.PAYMENT.PURPOSE" })} Тариф{" "}
              <span className={innerClasses.span}>
                "{selectedTariff.tariff.name}{" "}
                {selectedTariff.tariff_period ? selectedTariff.tariff_period.period : 0}"
              </span>{" "}
              для <span className={innerClasses.span}>{realUser.email}</span>, id ={" "}
              <span className={innerClasses.span}>{realUser.id}</span>{" "}
            </div>
            <div>
              {intl.formatMessage({ id: "TARIFFS.DATE.PICKER" })} {intl.formatDate(selectedDate)}
            </div>
            <div className={innerClasses.subTitle}>
              {intl.formatMessage({ id: "TARIFFS.PAYMENT.REQUISITES" })}
            </div>
            <div style={{ paddingBottom: 15 }}>
              {intl.formatMessage({ id: "TARIFFS.PAYMENT.FULLNAME" })}{" "}
              {intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT1" })} "
              {intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT1_2" })}"
            </div>
            <div>{intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT2" })}</div>
            <div>{intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT3" })}</div>
            <div>{intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT4" })}</div>
            <div>{intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT5" })}</div>
            <div>
              {intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT6" })} "
              {intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT6_2" })}"
            </div>
            <div>{intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT7" })}</div>
            <div>{intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT8" })}</div>
            <div style={{ paddingBottom: 15 }}>
              {intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT9" })}
            </div>
            <div>{intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT10" })}</div>
            <div>{intl.formatMessage({ id: "TARIFFS.PAYMENT.TEXT11" })}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default injectIntl(CashlessPayment);
