import { IUser } from "../../../../interfaces/users";

const admin = {
  value: "Администратор",
  id: "ROLE_ADMIN",
};
const manager = {
  value: "Менеджер",
  id: "ROLE_MANAGER",
};
const buyer = {
  value: "Покупатель",
  id: "ROLE_BUYER",
};
const vendor = {
  value: "Продавец",
  id: "ROLE_VENDOR",
};
const trader = {
  value: "Трейдер",
  id: "ROLE_TRADER",
};
const transporter = {
  value: "Перевозчик",
  id: "ROLE_TRANSPORTER",
};

export const getInitialValues = (user: IUser | undefined) => ({
  login: user?.login || "",
  fio: user?.fio || "",
  phone: user?.phone || "",
  email: user?.email || "",
  password: "",
  repeatPassword: "",
  role: user?.roles?.length ? user.roles[0] : "",
  status: user?.status || "",
  funnel_state_id: user?.funnel_state?.id || 0,
  is_funnel_state_automate: user?.is_funnel_state_automate || false,
  use_vat: user?.use_vat === undefined ? false : user.use_vat,
  company_confirmed_by_email: user ? user.company_confirmed_by_email : false,
  company_confirmed_by_phone: user ? user.company_confirmed_by_phone : false,
  company_confirmed_by_payment: user ? user.company_confirmed_by_payment : false,
  company_name: user && user.company ? user.company.short_name : "",
  company_id: user && user.company ? user.company.id : 0,
});

export const roles = [admin, manager, buyer, vendor, trader, transporter];
