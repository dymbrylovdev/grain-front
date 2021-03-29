import { IUserRoles } from "../interfaces/users";

export const userRoles: IUserRoles[] = [
  {
    id: 1,
    label: "Покупатель",
    role: "ROLE_BUYER"
  },
  {
    id: 2,
    label: "Продавец",
    role: "ROLE_VENDOR"
  },
  {
    id: 3,
    label: "Трейдер",
    role: "ROLE_TRADER"
  },
  {
    id: 4,
    label: "Менеджер",
    role: "ROLE_MANAGER"
  },
  {
    id: 5,
    label: "Администратор",
    role: "ROLE_ADMIN"
  },
];
