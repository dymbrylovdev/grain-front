import { ICompany } from "./companies";
import { ILocation } from "./locations";

export type TRole = "ROLE_ADMIN" | "ROLE_VENDOR" | "ROLE_BUYER";

export interface IUser {
  id: number;
  email: string;
  fio?: string;
  phone?: string;
  login: string;
  status?: string;
  is_buyer?: boolean;
  is_admin?: boolean;
  is_vendor?: boolean;
  location?: ILocation;
  company?: ICompany;
  company_confirmed_by_email?: boolean;
  company_confirmed_by_phone?: boolean;
  company_confirmed_by_payment?: boolean;
  points: ILocation[];
}

export interface IUserForRegister {
  email: string;
  roles: TRole[];
  login: string;
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
