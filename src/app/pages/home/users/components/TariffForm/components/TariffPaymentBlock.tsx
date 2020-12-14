import React from "react";
import { Dialog, Grid as div } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { injectIntl, IntlShape, WrappedComponentProps } from "react-intl";
import { ITariff } from "../../../../../../interfaces/tariffs";
import { IUser } from "../../../../../../interfaces/users";

interface IProps {
  intl: IntlShape;
  realUser: IUser;
  openModal: boolean;
  setOpenModal: any;
  selectedTariff: ITariff | undefined;
}

const TariffPaymentBlock: React.FC<IProps & WrappedComponentProps> = ({
  intl,
  realUser,
  openModal,
  setOpenModal,
  selectedTariff,
}) => {
  return (
    <Dialog open={openModal} onClose={() => setOpenModal(!openModal)}>
      <div style={{ padding: 10 }}>
        {!selectedTariff || !realUser ? (
          <Skeleton width="100%" height={68} animation="wave" />
        ) : (
          <>
            <div>{intl.formatMessage({ id: "TARIFFS.PAYMENT.FORM.TITLE" })}</div>
            <div>
              <div><b>Сумма платежа:</b> {selectedTariff.price}</div>
              <br />
              <div>
                <b>Назначение платежа:</b> Тариф "{selectedTariff.tariff.name}{" "}
                {selectedTariff.tariff_period ? selectedTariff.tariff_period.period : 0}" для{" "}
                {realUser.email}, id = {realUser.id} {`Начало действия тарифа: `}
              </div>
              <br />
              <div>
                <b>Реквизиты для оплаты</b>
              </div>
              <div>Полное наименование: ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "АМБАР"</div>
              <br />
              <div>Директор: Егиазарова Кристина Суреновна</div>
              <div>ОГРН: 1202300046915</div>
              <div>ИНН: 2312294751</div>
              <div>КПП: 231201001</div>
              <div>Наименование банка: АО "Альфа БАНК"</div>
              <div>Корреспондентский счет: 30101810200000000593</div>
              <div>БИК: 044525593</div>
              <div>Расчетный счет: 40702810001100023020</div>
              <br />
              <div>Адрес для корреспонденции: 350080 г. Краснодар</div>
              <div>
                Юридический адрес: КРАЙ КРАСНОДАРСКИЙ, г. КРАСНОДАР, УЛИЦА ИМ. ТЮЛЯЕВА, ДОМ 2 КОРПУС
                2
              </div>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default injectIntl(TariffPaymentBlock);
