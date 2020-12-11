import React from "react";
import { Dialog, Grid as div } from "@material-ui/core";
import { injectIntl, IntlShape, WrappedComponentProps } from "react-intl";
import { IUser } from "../../../../interfaces/users";

interface IProps {
  intl: IntlShape;
  realUser: IUser;
  openModal: boolean;
  setOpenModal: any;
}

const TariffPaymentBlock: React.FC<IProps & WrappedComponentProps> = ({
  intl,
  realUser,
  openModal,
  setOpenModal,
}) => {

  return (
    <Dialog open={openModal} onClose={() => setOpenModal(!openModal)}>
      <div style={{ padding: 10 }}>
        <h5>{intl.formatMessage({ id: "TARIFFS.PAYMENT.FORM.TITLE" })}</h5>
        <div>
          <h6>{/* <b>Сумма платежа:</b> {realSelectedTariff.price} */}</h6>
          <br />
          <h6>
            {/* <b>Назначение платежа:</b> Тариф "{realSelectedTariff.tariff.name}{" "}
            {realSelectedTariff.tariff_period ? realSelectedTariff.tariff_period.period : 0}" для{" "}
            {realUser.email}, id = {realUser.id}{" "}
            {`Начало действия тарифа: ${intl.formatDate(selectedDate)}`} */}
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
          <h6>Наименование банка: АО "Альфа БАНК"</h6>
          <h6>Корреспондентский счет: 30101810200000000593</h6>
          <h6>БИК: 044525593</h6>
          <h6>Расчетный счет: 40702810001100023020</h6>
          <br />
          <h6>Адрес для корреспонденции: 350080 г. Краснодар</h6>
          <h6>
            Юридический адрес: КРАЙ КРАСНОДАРСКИЙ, г. КРАСНОДАР, УЛИЦА ИМ. ТЮЛЯЕВА, ДОМ 2 КОРПУС 2
          </h6>
        </div>
      </div>
    </Dialog>
  );
};

export default injectIntl(TariffPaymentBlock);
