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
  login: user ? user.login || "" : "",
  fio: user ? user.fio || "" : "",
  phone: user ? user.phone || "" : "",
  email: user ? user.email || "" : "",
  password: "",
  repeatPassword: "",
  role: user ? (user.is_vendor ? vendor.id : user.is_buyer ? buyer.id : admin.id) : "EMPTY",
  status: user ? user.status || "EMPTY" : "EMPTY",
});

export const roles = [admin, buyer, vendor];
