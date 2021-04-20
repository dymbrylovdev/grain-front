import { ICompany } from "./companies";
import { ILocation } from "./locations";
import { ICrop } from "./crops";
import { ITariff, ITariffType, ITariffPeriod } from "./tariffs";

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
  contact_view_count?: number;
  points: ILocation[];
  registration_type: string;
  funnel_state: {
    id: number;
    name: string;
    color: string;
    engagement: number;
    role: TRole;
  } | null;
  is_funnel_state_automate?: boolean;
  use_vat: boolean;
  tariff_matrix: ITariff;
  tariff_prolongations: any;
  tariff_price?: number[];
  tariff_expired_at?: Date;
  tariff_start_date?: Date;
  crops: ICrop[];
  available_filter_count: number;
}

export interface IUserForRegister {
  email?: string;
  phone?: string;
  code?: string;
  roles: TRole[];
  login?: string;
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
  tariff_matrix_id?: number;
  tariff_matrix_id_for_prolongation?: number;
  tariff_type_id?: number;
  tariff_period_id?: number;
  tariff_expired_at?: Date;
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

export interface ILoginByPhoneData {
  phone: string;
  code: string;
}

export interface IRegSuccessData {
  email: string;
  roles: TRole[];
  login: string;
}

export interface IUserRoles {
  id: number;
  label: string;
  role: string;
}

export interface IUserBidFilters {
  filter_count: number;
  filters: any[];
}

export type LoginType = "email" | "phone"
