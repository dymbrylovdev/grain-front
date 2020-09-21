export interface ITrial {
  manager_email: string;
  manager_phone: string;
  trial_tariff_expired_message: string;
  trial_days: number;
}

export interface ITrialToRequest {
  manager_email?: string;
  manager_phone?: string;
  trial_tariff_expired_message?: string;
  trial_days?: number;
}
