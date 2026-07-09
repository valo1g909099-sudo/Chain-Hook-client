export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://chain-hook-backend-evj9.vercel.app/api',
  TIMEOUT_MS: 15000,
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/auth/login/',
    REGISTER: '/users/auth/register/',
    PROFILE: '/users/auth/profile/',
    LOGOUT: '/users/auth/logout/',
  },

  SETTINGS: {
    ALL: '/settings/',
  },

  WALLET: {
    BASE: '/wallet/',
    TRANSACTIONS: '/wallet/transactions/',
    CONVERT: '/wallet/convert/',
    TRANSFER: '/wallet/transfer/',
    PAYMENT: '/wallet/payment/',
    PRICE_HISTORY: '/wallet/price-history/',
    ANALYTICS: '/wallet/analytics/',
  },

};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ewallet_access_token',
  REFRESH_TOKEN: 'ewallet_refresh_token',
  USER: 'ewallet_user',
};

export function buildUrl(path: string): string {
  return `${API_CONFIG.BASE_URL}${path}`;
}