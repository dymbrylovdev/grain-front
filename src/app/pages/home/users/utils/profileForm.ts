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

export const getInitialValues = (user: IUser | undefined) => ({
  login: user?.login || "",
  fio: user?.fio || "",
  phone: user?.phone || "",
  email: user?.email || "",
  password: "",
  repeatPassword: "",
  role: user?.roles[0] || "",
  status: user?.status || "",
  funnel_state_id: user?.funnel_state?.id || 0,
  is_funnel_state_automate: user?.is_funnel_state_automate || false,
  use_vat: user?.use_vat === undefined ? false : user.use_vat,
});

export const roles = [admin, manager, buyer, vendor, trader];
