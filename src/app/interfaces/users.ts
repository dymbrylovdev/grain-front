import { ICompany } from "./companies";
import { ILocation } from "./locations";
import { ICrop } from "./crops";
import { ITariff } from "./tariffs";

export type TRole = "ROLE_ADMIN" | "ROLE_VENDOR" | "ROLE_BUYER" | "ROLE_MANAGER" | "ROLE_TRADER";

export interface IUser {
  id: number;
  email: string;
  fio?: string;
  phone?: string;
  login: string;
  status?: string;
  roles: TRole[];
  is_buyer?: boolean;
  is_admin?: boolean;
  is_vendor?: boolean;
  location?: ILocation;
  company?: ICompany;
  company_confirmed_by_email?: boolean;
  company_confirmed_by_phone?: boolean;
  company_confirmed_by_payment?: boolean;
  points: ILocation[];
  funnel_state: {
    id: number;
    name: string;
    color: string;
    engagement: number;
    role: TRole;
  } | null;
  is_funnel_state_automate?: boolean;
  use_vat: boolean;
  tariff: ITariff;
  crops: ICrop[];
}

export interface IUserForRegister {
  email: string;
  roles: TRole[];
  login: string;
  crop_ids?: number[];
}

export interface IUserForCreate {
  email?: string;
  roles?: TRole[];
  password?: string;
  fio?: string;
  phone?: string;
  login?: string;
  status?: string;
  location?: ILocation;
  company_id?: number;
  use_vat?: boolean;
  crop_ids?: number[];
}

export interface IUserForEdit {
  email?: string;
  password?: string;
  fio?: string;
  phone?: string;
  login?: string;
  status?: string;
  location?: ILocation;
  company_id?: number;
  company_confirmed_by_email?: boolean;
  company_confirmed_by_phone?: boolean;
  company_confirmed_by_payment?: boolean;
  funnel_state_id?: number;
  is_funnel_state_automate?: boolean;
  use_vat?: boolean;
  tariff_id?: number;
  crop_ids?: number[];
}

export interface IChangePasswordData {
  password: string;
  password2: string;
  code: string;
}

export interface ILoginSuccessData extends IUser {
  api_token: string;
}

export interface IRegSuccessData {
  email: string;
  roles: TRole[];
  login: string;
}
