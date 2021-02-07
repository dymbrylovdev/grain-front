import React, { useEffect } from "react";

const PaymentByCard = ({ realUser, selectedTariff, selectedDate, merchant, trial }) => {
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
        //merchnat id for test server 14652801465280
        merchant_id: 1454955, // merchant.merchant_id,
        currency: "RUB",
        order_id: new Date().getTime(),
        amount: selectedTariff.price * 100,
        order_desc: `Тариф: ${selectedTariff.tariff.name}, период: ${selectedTariff.tariff_period.period} дней`,
        email:
          realUser.registration_type === "phone" && trial ? trial.manager_email : realUser.email,
        server_callback_url: "https://api.kupit-zerno.com/api/fondy/callback",
        lang: "ru",
        product_id: selectedTariff.id,
        custom: { start_date: selectedDate.toString(), user_id: realUser.id },
      },
    };
    //@ts-ignore
    const app = window.fondy("#fondy-container", Options);
  }, [
    realUser.email,
    realUser.id,
    realUser.registration_type,
    selectedDate,
    trial,
    trial.manager_email,
    selectedTariff.id,
    selectedTariff.price,
    selectedTariff.tariff.name,
    selectedTariff.tariff_period.period,
    trial.manager_email,
  ]);

  return <div id="fondy-container"></div>;
};

export default PaymentByCard;
