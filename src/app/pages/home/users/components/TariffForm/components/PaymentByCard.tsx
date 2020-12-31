import React, { useEffect } from "react";

const PaymentByCard = ({ realUser, selectedTariff, selectedDate, merchant }) => {

  const moyaFunc = () => console.log('moya func');

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
        theme: {
          type: "light",
          preset: "black",
        },
        email: true,
      },
      params: {
        merchant_id: 1465280,
        currency: "RUB",
        order_id: new Date().getTime(),
        amount: selectedTariff.price * 100,
        order_desc: `Тариф: ${selectedTariff.tariff.name}, период: ${selectedTariff.tariff_period.period} дней`,
        email: realUser.email,
        server_callback_url: "https://grain15-api.me-interactive.net/api/fondy/callback",
        lang: "ru",
        product_id: selectedTariff.id,
        custom: {start_date: selectedDate.toString()},
      },
    };
    //@ts-ignore
    const app = window.fondy("#fondy-container", Options);
  }, []);

  return (
    <div id="fondy-container"></div>
  );
};

export default PaymentByCard;
