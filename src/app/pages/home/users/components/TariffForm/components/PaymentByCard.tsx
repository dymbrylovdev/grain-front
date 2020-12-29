import React, { useEffect } from "react";

const PaymentByCard = () => {
  useEffect(() => {
    const Options = {
      options: {
        methods: ["card"],
        methods_disabled: ["banklinks_eu", "local_methods"],
        card_icons: [],
        default_country: "RU",
        full_screen: false,
        title: "Оплата тарифа",
        active_tab: "card",
        lang: ["en"],
        theme: {
          type: "light",
          preset: "black",
        },
        email: true
      },
      params: {
        merchant_id: 1396424,
        currency: "RUB",
        order_id: new Date().getTime(),
        amount: 5000,
        order_desc: "Тариф такой-то, период такой-то",
      },
      messages: {
        en: {
          card_number: "Номер карты",
          email: "Электронная почта",
          expiry_date: "Срок действия",
          pay: "Оплатить",
        },
      },
      validate: {
        en: {
          credit_card: function (field) {
            return "Ошибка " + field + " must be a valid curd number(en)";
          },
          custom_field_1: function (field) {
            return "Поля " + field + " обязательный для заполнения";
          }
        },
      }
    };
    //@ts-ignore
    window.fondy("#fondy-container", Options);
  }, []);

  return (
    <div style={{paddingTop: 10, paddingRight: 20, paddingBottom: 10, paddingLeft: 20}}>
      <div id="fondy-container"></div>
    </div>
  );
};

export default PaymentByCard;
