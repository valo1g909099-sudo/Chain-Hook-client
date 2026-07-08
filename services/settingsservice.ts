import { ENDPOINTS } from './config';
import { apiRequest } from './apiClient';

// --- Section shapes, mirroring the DRF serializers 1:1 ---

export interface ProfileSettings {
  id: number;
  bio: string;
  create_date_time: string;
  update_date_time: string;
}

export interface NotificationSettings {
  id: number;
  email: boolean;
  push: boolean;
  marketing: boolean;
  create_date_time: string;
  update_date_time: string;
}

export interface PrivacySettings {
  id: number;
  auth_2f: boolean;
  data_sharing: boolean;
  activity_status: boolean;
  create_date_time: string;
  update_date_time: string;
}

export interface LanguageSettings {
  id: number;
  lang: string;
  create_date_time: string;
  update_date_time: string;
}

export interface CurrencySettings {
  id: number;
  currency: string;
  create_date_time: string;
  update_date_time: string;
}

export interface TimeZoneSettings {
  id: number;
  time_zone: string;
  create_date_time: string;
  update_date_time: string;
}

export interface Security2FASettings {
  id: number;
  authenticator_app: boolean;
  OTP: boolean;
  B_T: boolean;
  create_date_time: string;
  update_date_time: string;
}

// GET /settings/ response — each section is null until the user has set it up
export interface AllSettings {
  profile: ProfileSettings | null;
  notifications: NotificationSettings | null;
  privacy: PrivacySettings | null;
  language: LanguageSettings | null;
  currency: CurrencySettings | null;
  time_zone: TimeZoneSettings | null;
  security_2fa: Security2FASettings | null;
}


export interface UpdateSettingsPayload {
  profile?: Partial<Pick<ProfileSettings, 'bio'>>;
  notifications?: Partial<Pick<NotificationSettings, 'email' | 'push' | 'marketing'>>;
  privacy?: Partial<Pick<PrivacySettings, 'auth_2f' | 'data_sharing' | 'activity_status'>>;
  language?: Partial<Pick<LanguageSettings, 'lang'>>;
  currency?: Partial<Pick<CurrencySettings, 'currency'>>;
  time_zone?: Partial<Pick<TimeZoneSettings, 'time_zone'>>;
  security_2fa?: Partial<Pick<Security2FASettings, 'authenticator_app' | 'OTP' | 'B_T'>>;
}

export type UpdateSettingsResponse =
  | Partial<AllSettings>
  | {
      updated: Partial<AllSettings>;
      errors: Record<string, unknown>;
    };

export const settingsService = {
  async getAll(): Promise<AllSettings> {
    return apiRequest<AllSettings>(ENDPOINTS.SETTINGS.ALL, { method: 'GET' });
  },

  async update(payload: UpdateSettingsPayload): Promise<UpdateSettingsResponse> {
    return apiRequest<UpdateSettingsResponse>(ENDPOINTS.SETTINGS.ALL, {
      method: 'PATCH',
      data: payload,
    });
  },
};