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

export const сompareRoles = (roles: TRole[], role: TRole): boolean => {
    return roles.includes(role);
}

export const getConfirmCompanyString = (user: IUser | undefined, intl: IntlShape): string => {
  let confirmCompanyString = "";
  if (!user?.company) {
    confirmCompanyString = intl.formatMessage({ id: "COMPANY.NO_COMPANY" });
  } else {
    if (!user.company_confirmed_by_email && !user.company_confirmed_by_payment) {
      confirmCompanyString = intl.formatMessage({ id: "COMPANY.CONFIRM.NO_CONFIRM" });
    } else {
      confirmCompanyString = intl.formatMessage({ id: "COMPANY.CONFIRM.TITLE2" });
    }
  }
  return confirmCompanyString;
};

export const getConfirmCompanyStringOriginal = (user: IUser | undefined, intl: IntlShape): string => {
  let confirmCompanyString = "";
  if (!user?.company) {
    confirmCompanyString = intl.formatMessage({ id: "COMPANY.NO_COMPANY" });
  } else {
    if (!user.company_confirmed_by_email && !user.company_confirmed_by_payment && !user.company_confirmed_by_phone) {
      confirmCompanyString = intl.formatMessage({ id: "COMPANY.CONFIRM.NO_CONFIRM" });
    } else {
      let byEmailText =
        intl.formatMessage({ id: "COMPANY.CONFIRM.BY_EMAIL" }) +
        (!user.company_confirmed_by_payment && !user.company_confirmed_by_phone ? "." : ", ");
      let byPhoneText = intl.formatMessage({ id: "COMPANY.CONFIRM.BY_PHONE" }) + (!user.company_confirmed_by_payment ? "." : ", ");
      let byPaymentText = intl.formatMessage({ id: "COMPANY.CONFIRM.BY_PAY" }) + ".";
      confirmCompanyString = `${intl.formatMessage({ id: "COMPANY.CONFIRM.TITLE" })} ${user.company_confirmed_by_email ? byEmailText : ""}${
        user.company_confirmed_by_phone ? byPhoneText : ""
      }${user.company_confirmed_by_payment ? byPaymentText : ""}`;
    }
  }
  return confirmCompanyString;
};

export const formatAsThousands = (data: string | number) => String(data).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${"\u00A0"}`);

export const formatPhone = (phone: string) => `+${phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5")}`;
