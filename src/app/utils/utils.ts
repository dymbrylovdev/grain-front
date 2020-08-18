import { IUser, TRole } from "../interfaces/users";
import { IntlShape } from "react-intl";

export function itemById<T extends any>(items: T[], id: number): T | undefined {
  let newItem: T | undefined = undefined;
  if (items && items.length) {
    items.forEach(item => {
      // @ts-ignore
      if (item.id === id) {
        newItem = item;
      }
    });
  }
  return newItem;
}

export const accessByRoles = (who: IUser | undefined, roles: TRole[]): boolean => {
  if (!who) {
    return false;
  } else {
    if (roles && roles.length && who.roles && who.roles.length && roles.includes(who.roles[0])) {
      return true;
    } else {
      return false;
    }
  }
};

export const getConfirmCompanyString = (user: IUser | undefined, intl: IntlShape): string => {
  let confirmCompanyString = "";
  if (!user?.company) {
    confirmCompanyString = intl.formatMessage({ id: "COMPANY.NO_COMPANY" });
  } else {
    if (
      !user.company_confirmed_by_email &&
      !user.company_confirmed_by_payment &&
      !user.company_confirmed_by_phone
    ) {
      confirmCompanyString = intl.formatMessage({ id: "COMPANY.CONFIRM.NO_CONFIRM" });
    } else {
      let byEmailText =
        intl.formatMessage({ id: "COMPANY.CONFIRM.BY_EMAIL" }) +
        (!user.company_confirmed_by_payment && !user.company_confirmed_by_phone ? "." : ", ");
      let byPhoneText =
        intl.formatMessage({ id: "COMPANY.CONFIRM.BY_PHONE" }) +
        (!user.company_confirmed_by_payment ? "." : ", ");
      let byPaymentText = intl.formatMessage({ id: "COMPANY.CONFIRM.BY_PAY" }) + ".";
      confirmCompanyString = `${intl.formatMessage({ id: "COMPANY.CONFIRM.TITLE" })} ${
        user.company_confirmed_by_email ? byEmailText : ""
      }${user.company_confirmed_by_phone ? byPhoneText : ""}${
        user.company_confirmed_by_payment ? byPaymentText : ""
      }`;
    }
  }
  return confirmCompanyString;
};
