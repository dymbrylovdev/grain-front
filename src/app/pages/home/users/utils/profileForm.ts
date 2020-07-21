import { IUser } from "../../../../interfaces/users";

const admin = {
  value: "Администратор",
  id: "ROLE_ADMIN",
};
const vendor = {
  value: "Продавец",
  id: "ROLE_VENDOR",
};

const buyer = {
  value: "Покупатель",
  id: "ROLE_BUYER",
};

export const getInitialValues = (user: IUser | undefined) => ({
  login: user?.login || "",
  fio: user?.fio || "",
  phone: user?.phone || "",
  email: user?.email || "",
  password: "",
  repeatPassword: "",
  role: user ? (user.is_vendor ? vendor.id : user.is_buyer ? buyer.id : admin.id) : "",
  status: user?.status || "",
  funnel_state_id: user?.funnel_state?.id || 0,
  is_funnel_state_automate: user?.is_funnel_state_automate || false,
  use_vat: user?.use_vat === undefined ? false : user.use_vat,
});

export const roles = [admin, buyer, vendor];
