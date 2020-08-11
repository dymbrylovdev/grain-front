import { IUser } from "../../../../interfaces/users";

export const getInitialValues = (user: IUser | undefined) => ({
  company_confirmed_by_email: user ? user.company_confirmed_by_email : false,
  company_confirmed_by_phone: user ? user.company_confirmed_by_phone : false,
  company_confirmed_by_payment: user ? user.company_confirmed_by_payment : false,
  company_name: user && user.company ? user.company.short_name : "",
  company_id: user && user.company ? user.company.id : 0,
});
