import React, { useEffect } from "react";

const PaymentByCard = ({ realUser, selectedTariff }) => {

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
        merchant_id: 1465280,
        currency: "RUB",
        order_id: new Date().getTime(),
        amount: selectedTariff.price * 100,
        order_desc: `Тариф: ${selectedTariff.tariff.name}, период: ${selectedTariff.tariff_period.period} дней`,
        email: realUser.email,
      },
      messages: {
        en: {
          card_number: "Номер карты",
          email: "Электронная почта",
          expiry_date: "Срок действия",
          pay: "Оплатить",
        },
      }
    };
    //@ts-ignore
    window.fondy("#fondy-container", Options);
  }, []);

  return (
    <div id="fondy-container"></div>
  );
};

export default PaymentByCard;
